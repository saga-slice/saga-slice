import { combineReducers } from 'redux';
import { isTrueObject, assert } from './util';
import { areSagaSlices } from './SagaSlice';

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
export const rootReducer = function (modules, others = {}) {

    areSagaSlices(modules);
    assert(isTrueObject(others), 'other reducers must be an object');

    const reducers = modules.reduce((a, { name, reducer }) => {

        a[name] = reducer;
        return a;
    }, {});

    return combineReducers({
        ...reducers,
        ...others
    });
};
