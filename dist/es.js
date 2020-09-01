import * as redux from 'redux';
import * as effects from 'redux-saga/effects';
import * as immer from 'immer';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = exports.rootSaga = exports.createModule = void 0;



const { takeLatest } = effects;
const genName = (name, key) => `${name}/${key}`;
const sagaTakers = [
    'takeEvery',
    'takeLatest',
    'takeMaybe',
    'takeLeading',
    'debounce',
    'throttle'
];
const hasSagaTakers = (keys) => {
    return sagaTakers.reduce((a, val) => {
        if (a) {
            return a;
        }
        return keys.includes(val);
    }, false);
};
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
exports.createModule = (opts) => {
    const { name, initialState } = opts;
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
            takerOpts = Object.entries(takerOpts).reduce((takers, optEntry) => {
                const [key, val] = optEntry;
                // if key is a taker
                // iterate through its value and set taker
                if (sagaTakers.includes(key)) {
                    val.forEach((t) => {
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
    const extracted = reducerEntries.reduce((acc, entry) => {
        const [key, val] = entry;
        // Create the type
        const type = genName(name, key);
        // Create action
        acc.actions[key] = (payload) => ({ type, payload });
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
    const moduleReducer = (state = initialState, action) => {
        const { type, payload } = action;
        const reducer = reducers[type];
        if (typeof reducer === 'function') {
            return immer.produce(state, draft => reducer(draft, payload));
        }
        return state;
    };
    // Iterate over sagas and prepare them
    let sagas = [];
    if (opts.sagas) {
        const sagasEntries = Object.entries(opts.sagas(actions));
        sagas = sagasEntries.map((entry) => {
            const [type, sagaObj] = entry;
            // Saga object can be a generator function, or object
            // with `saga`, `taker`, `watcher`
            let saga = sagaObj.saga;
            let taker = sagaObj.taker || takers[type];
            if (!taker) {
                taker = defaultTaker;
            }
            if (typeof sagaObj === 'function') {
                saga = sagaObj;
            }
            return function* () {
                yield taker(type, saga);
            };
        });
    }
    // Returns actions in a camel case format based on name `[slice name][action]`
    // EG: `todoFetchAll` `todoFetchSuccess` etc
    const namedActions = Object.entries(actions).reduce((acc, entry) => {
        const [key, action] = entry;
        const namedKey = name + key[0].toUpperCase() + key.slice(1);
        acc[namedKey] = action;
        return acc;
    }, {});
    // State selector
    const getState = (state) => state[name];
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
exports.rootSaga = function (modules) {
    return function* () {
        yield effects.all(modules
            .map((slice) => slice.sagas)
            .reduce((a, c) => a.concat(c), [])
            .map((saga) => saga()));
    };
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
exports.rootReducer = function (modules, others = {}) {
    const reducers = modules.reduce((a, slice) => {
        const { name, reducer } = slice;
        a[name] = reducer;
        return a;
    }, {});
    return redux.combineReducers({
        ...reducers,
        ...others
    });
};
});

var index = unwrapExports(lib);
var lib_1 = lib.rootReducer;
var lib_2 = lib.rootSaga;
var lib_3 = lib.createModule;

export default index;
export { lib_3 as createModule, lib_1 as rootReducer, lib_2 as rootSaga };
