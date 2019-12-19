import { combineReducers } from 'redux';

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
