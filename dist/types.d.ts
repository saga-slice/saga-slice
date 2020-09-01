import * as effects from 'redux-saga/effects';
export interface SagaObject {
    (...args: any): Generator<any, void, any>;
}
export interface SagaObject {
    saga?: Generator<any, void, any>;
    taker?: any;
}
interface RequiredModuleOpts {
    name: string;
    initialState: {
        [key: string]: any;
    };
    reducers: {
        [key: string]: () => any;
    };
}
interface OptionalModuleOpts {
    sagas?: (actions: any) => {
        [type: string]: SagaObject;
    };
    takers?: {
        [type: string]: void | string[];
    };
}
export interface ModuleOpts extends Required<RequiredModuleOpts>, OptionalModuleOpts {
}
interface ReduxAction {
    type: string;
    payload: any;
}
export interface SagaSlice {
    name: string;
    namedActions: {
        (): {
            [key: string]: () => any;
        };
    };
    actions: {
        [key: string]: () => any;
    };
    getState: (state: any) => any;
    reducer: (state: any, action: ReduxAction) => any;
    sagas: Iterable<any>[];
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
export declare const createModule: (opts: ModuleOpts) => SagaSlice;
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
export declare const rootSaga: (modules: SagaSlice[]) => () => Generator<effects.AllEffect<any>, void, unknown>;
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
export declare const rootReducer: (modules: SagaSlice[], others?: {
    [key: string]: any;
}) => import("redux").Reducer<import("redux").CombinedState<{
    [x: string]: unknown;
}>, import("redux").Action<any>>;
export {};
