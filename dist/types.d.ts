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
interface SagaObject {
    (...args: any): void;
    saga: void;
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
    sagas?: (actions: object) => {
        [type: string]: SagaObject;
    };
    takers?: {
        [type: string]: void;
    };
}
interface ModuleOpts extends Required<RequiredModuleOpts>, OptionalModuleOpts {
}
interface OptsExtracts {
    actions: {
        [key: string]: any;
    };
    reducers: {
        [key: string]: any;
    };
    takers: {
        [key: string]: any;
    };
}
interface ReduxAction {
    type: string;
    payload: any;
}
interface SagaSlice {
    name: string;
    actions: {
        [key: string]: () => any;
    };
    reducer: (state: any, action: ReduxAction) => any;
    sagas: Iterable<any>[];
}
/**
 * Creates root reducer by combining reducers.
 * Accepts array of modules and and extra reducers object.
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
}) => import("redux").Reducer<{
    [x: string]: any;
}, import("redux").AnyAction>;
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
export declare const rootSaga: (modules: SagaSlice[]) => () => Generator<import("@redux-saga/types").CombinatorEffect<"ALL", any>, void, unknown>;