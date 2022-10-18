import * as effects from 'redux-saga/effects';
import { Slice as ReduxSlice, CreateSliceOptions as CreateReduxSliceOptions, SliceCaseReducers } from '@reduxjs/toolkit';
export interface SagaObject {
    (...args: any): Generator<any, void, any>;
}
export interface SagaObjectWithTaker {
    saga?: Generator<any, void, any>;
    taker?: any;
}
declare type ReducersType<StoreState> = {
    [key: string]: (state: StoreState, payload: any) => void;
};
interface RequiredModuleOpts<StoreState> {
    name: string;
    initialState: StoreState;
    reducers: ReducersType<StoreState>;
}
interface OptionalModuleOpts {
    sagas?: (actions: any) => {
        [type: string]: SagaObject | SagaObjectWithTaker;
    };
    takers?: {
        [type: string]: void | string[];
    };
}
export interface ModuleOpts<StoreState> extends Required<RequiredModuleOpts<StoreState>>, OptionalModuleOpts {
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
export declare const createModule: <StoreState>(opts: ModuleOpts<StoreState>) => SagaSlice;
export declare function createSlice<State, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(options: CreateSliceOptions<State, CaseReducers, Name>): Slice<State, CaseReducers, Name>;
/** Create a redux-compatible Slice that adds sagas. */
export interface CreateSliceOptions<State = any, CR extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string> extends CreateReduxSliceOptions<State, CR, Name>, OptionalModuleOpts {
}
/** A redux-compatible Slice that also supports sagas. */
export interface Slice<State = any, CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>, Name extends string = string> extends ReduxSlice<State, CaseReducers, Name> {
    sagas: GeneratorFunction[];
}
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
