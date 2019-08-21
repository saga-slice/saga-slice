import { takeEvery } from 'redux-saga/effects';
import { genName, isGenerator, isFunction, isTrueObject, assert } from './util';
import produce from "immer";
import SagaSlice from './SagaSlice';

/**
 * A callback that is passed redux actions and returns a generator
 * @callback SagaActionsGeneratorCallback
 * @param {Object} actions Redux action payload
 * @returns {Generator}
 */

/**
 * Redux module creator makes types out of name + reducer keys.
 * Abstracts away the need for types or the creation of actions.
 * Also supports the creation of sagas for async actions.
 *
 * @param {Object} opts Module config object
 * @param {String} opts.name Reducer name.
 * @param {Object} opts.initialState Initial reducer state.
 * @param {Object.<String, Function>} opts.reducers Map of reducers. Map keys are used as types.
 * @param {SagaActionsGeneratorCallback} opts.sagas
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
export const createModule = (opts) => {

    assert(opts && isTrueObject(opts), 'options must be an object');

    const {
        name,
        initialState
    } = opts;

    assert(opts.name, 'name is required');
    assert(opts.reducers, 'reducers is required');
    assert(opts.initialState !== undefined, 'initialState is required');
    assert(isTrueObject(opts.reducers), 'reducers must be an object');

    assert(opts.sagas === undefined || isFunction(opts.sagas), 'sagas must be a function');


    // Iterate over reducer properties, extract types and actions
    const { actions, reducers } = Object.entries(opts.reducers).reduce((acc, [key, val]) => {

        // Create the type
        const type = genName(name, key);

        // Create action
        acc.actions[key] = payload => ({ type, payload });
        acc.actions[key].type = type;
        acc.actions[key].toString = () => type;

        // Bind reducer to type
        acc.reducers[type] = val;

        return acc;
    }, { actions: {}, reducers: {} });

    // Reducer for redux using Immer
    const moduleReducer = (state = initialState, { type, payload }) => {

        const reducer = reducers[type];

        if (typeof reducer === 'function') {

            return produce(state, draft => reducer(draft, payload));
        }

        return state;
    }

    // Iterate over sagas and prepare them
    let sagas = [];
    if (opts.sagas) {
        sagas = Object.entries(opts.sagas(actions)).map(([type, sagaObj]) => {

            // Saga object can be a generator function, or object
            // with `saga`, `taker`, `watcher`
            let { saga, taker, watcher } = sagaObj;

            if (watcher) {

                return watcher;
            }

            if (isGenerator(sagaObj)) {

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

    return new SagaSlice({
        name,
        actions,
        sagas,
        reducer: moduleReducer
    });
};
