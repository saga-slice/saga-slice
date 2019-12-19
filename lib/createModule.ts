import { takeEvery } from 'redux-saga/effects';
import produce from "immer";

const genName = (name:string, key:string) => `${name}/${key}`;

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
export const createModule = (opts: ModuleOpts): SagaSlice => {

    const {
        name,
        initialState
    } = opts;

    const extractsInitial = {
        actions: {},
        reducers: {}
    };

    const reducerEntries = Object.entries(opts.reducers);

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

        return acc;
    }, extractsInitial);

    const { actions, reducers } = extracted;


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
            let taker: any = sagaObj.taker;

            if (typeof sagaObj === 'function') {

                saga = sagaObj;
                taker = takeEvery;
            }
            else {

                taker = taker || takeEvery;
            }

            return function* () {

                yield taker(type, saga);
            }
        });
    }

    return {
        name,
        actions,
        sagas,
        reducer: moduleReducer
    };
};
