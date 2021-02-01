import { combineReducers } from 'redux';
import * as effects from 'redux-saga/effects';
import * as immer from "immer";

const produce = (typeof immer === 'function' ? immer : immer.produce);

const { takeLatest } = effects;

const genName = (name:string, key:string) => `${name}/${key}`;

const sagaTakers = [
    'takeEvery',
    'takeLatest',
    'takeMaybe',
    'takeLeading',
    'debounce',
    'throttle'
];

const hasSagaTakers = (keys: string[]): boolean =>{

    return sagaTakers.reduce((a: boolean, val: string): boolean => {

        if (a) {
            return a;
        }

        return keys.includes(val);
    }, false);
};

export interface SagaObject {
    (...args: any): Generator<any, void, any>
}

export interface SagaObject {
    saga?: Generator<any, void, any>,
    taker?: any
}

interface RequiredModuleOpts<StoreState> {
    name: string,
    initialState: {
        [key: string]: any
    },
    reducers: {
        [key: string]: (state: StoreState, payload) => void
    }
}

interface OptionalModuleOpts {
    sagas?: (actions: any) => {
        [type: string]: SagaObject
    },
    takers?: {
        [type: string]: void | string[],
    }
};

export interface ModuleOpts<StoreState>
  extends Required<RequiredModuleOpts<StoreState>>, OptionalModuleOpts {}

interface OptsExtracts {
    actions: {
        [key: string]: any
    },
    reducers: {
        [key: string]: any
    },
    takers: {
        [key: string]: any
    }
};

interface ReduxAction {
    type: string,
    payload: any
};

export interface SagaSlice {

    name: string,
    namedActions: {
        (): {
            [key: string]: () => any
        }
    },
    actions: {
        [key: string]: () => any
    },
    getState: (state: any) => any,
    reducer: (state: any, action: ReduxAction) => any,
    sagas: Iterable<any>[]
}

/**
 * Redux module creator makes types out of name + reducer keys.
 * Abstracts away the need for types or the creation of actions.
 * Also supports the creation of sagas for async actions.
 *
 * @param {ModuleOpts} opts Module config object
 *
 * @returns {SagaSlice} The created module with `name`,`actions`,`sagas`,`reducer`
 *
 * @example
 *
 * export default createModule({
 *     name: 'todos', // required
 *     initialState, // required
 *     reducers: { // required
 *          // Uses Immer for immutable state
 *          fetchAll: (state) => {
 *              state.isFetching = true;
 *          },
 *          fetchSuccess: (state, data) => {
 *              state.isFetching = false;
 *              state.data = data;
 *          },
 *          fetchFail: (state, error) => {
 *              state.isFetching = false;
 *              state.error = error;
 *          },
 *          // create empty functions to use as types for sagas
 *          someOtherAction: () => {},
 *     },
 *     sagas: (A) => ({
 *         * [A.fetchAll]({ payload }) {
 *             try {
 *                 const { data } = yield axios.get('/todos');
 *                 yield put(A.fetchSuccess(data));
 *             }
 *             catch (e) {
 *                 yield put(A.fetchFail(e));
 *             }
 *         }
 *     })
 * });
 */
export const createModule = <StoreState>(opts: ModuleOpts<StoreState>): SagaSlice => {

    const {
        name,
        initialState
    } = opts;

    const extractsInitial = {
        actions: {},
        reducers: {},
        takers: {}
    };

    const reducerEntries = Object.entries(opts.reducers);

    let defaultTaker = takeLatest;
    let takerOpts = opts.takers || {};

    // if takers config is a string that is an existing effect
    // set it to that effect
    if (typeof takerOpts === 'string' && sagaTakers.includes(takerOpts)) {

        defaultTaker = effects[takerOpts];
    }
    else if (typeof takerOpts === 'function') {

        defaultTaker = takerOpts;
    }
    else {

        // if takers is configured to { [taker]: [...reduxTypes] }
        // we're going to reverse that config and set it to { [reduxType]: effects[taker] }
        if (hasSagaTakers(Object.keys(takerOpts))) {

            takerOpts = Object.entries(takerOpts).reduce((takers: any, optEntry: [string, any]) => {

                const [key, val] = optEntry;

                // if key is a taker
                // iterate through its value and set taker
                if (sagaTakers.includes(key)) {

                    val.forEach((t: string) => {

                        takers[t] = effects[key];
                    });
                }
                else {

                    // leave other configs alone as well
                    takers[key] = val;
                }

                return takers;
            }, {});
        }
    }


    // Iterate over reducer properties, extract types and actions
    const extracted: OptsExtracts = reducerEntries.reduce((acc: OptsExtracts, entry: [string, any]) => {

        const [key, val] = entry;
        // Create the type
        const type = genName(name, key);

        // Create action
        acc.actions[<any>key] = (payload: any) => ({ type, payload });
        acc.actions[key].type = type;
        acc.actions[key].toString = () => type;

        // Bind reducer to type
        acc.reducers[type] = val;

        // Set takers either from options or defaultTaker
        acc.takers[type] = (takerOpts || {})[key] || defaultTaker;


        return acc;
    }, extractsInitial);

    const { actions, reducers, takers } = extracted;


    // Reducer for redux using Immer
    const moduleReducer = (state = initialState, action: ReduxAction) => {

        const { type, payload } = action;
        const reducer = reducers[type];

        if (typeof reducer === 'function') {

            return produce(state, draft => reducer(draft, payload));
        }

        return state;
    }

    // Iterate over sagas and prepare them
    let sagas: any[] = [];


    if (opts.sagas) {

        const sagasEntries = Object.entries(opts.sagas(actions));

        sagas = sagasEntries.map((entry: [string, any]) => {

            const [type, sagaObj] = entry;
            // Saga object can be a generator function, or object
            // with `saga`, `taker`, `watcher`

            let saga: any = sagaObj.saga;
            let taker: any = sagaObj.taker || takers[type];

            if (!taker) {

                taker = defaultTaker;
            }

            if (typeof sagaObj === 'function') {

                saga = sagaObj;
            }

            return function* () {

                yield taker(type, saga);
            }
        });
    }

    // Returns actions in a camel case format based on name `[slice name][action]`
    // EG: `todoFetchAll` `todoFetchSuccess` etc
    const namedActions = Object.entries(actions).reduce((acc: any, entry) => {

        const [key, action] = entry;

        const namedKey = name + key[0].toUpperCase() + key.slice(1);

        acc[namedKey] = action;

        return acc;
    }, {});

    // State selector
    const getState = (state: any) => state[name];

    return {
        name,
        namedActions,
        actions,
        sagas,
        getState,
        reducer: moduleReducer
    };
};



/**
 *
 * Creates a root saga. Accepts an array of modules.
 *
 * @param {SagaSlice[]} modules Array of modules created using `createModule`
 *
 * @returns {Generator} Generator function for sagas
 *
 * @example
 *
 * const sagaMiddleware = createSagaMiddleware();
 * sagaMiddleware.run(rootSaga(sagaSliceModules));
 */
export const rootSaga = function (modules: SagaSlice[]) {

    return function* () {

        yield effects.all(
            modules
                .map((slice) => slice.sagas)
                .reduce((a, c: any) => a.concat(c), [])
                .map((saga: any) => saga())
        );
    }
};


/**
 * Creates root reducer by combining reducers.
 * Accepts array of modules and extra reducers object.
 *
 * @arg {Array.<SagaSlice>} modules Array of modules created using `createModule`
 * @arg {Object.<String, Function>} others Object of extra reducers not created by `saga-slice`
 *
 * @returns {Function} Root redux reducer using `combineReducers()`
 *
 * @example
 *
 * const store = createStore(
 *     rootReducer(sagaSliceModules, extraReducers),
 *     composeEnhancers(applyMiddleware(...middleware))
 * );
 */
export const rootReducer = function (modules: SagaSlice[], others: { [key: string]: any } = {}) {

    const reducers = modules.reduce((a: { [key: string]: any }, slice: SagaSlice) => {

        const { name, reducer } = slice;
        a[name] = reducer;
        return a;
    }, {});

    return combineReducers({
        ...reducers,
        ...others
    });
};
