import { combineReducers } from 'redux';
import { isTrueObject, assert } from './util';
import { areSagaSlices } from './SagaSlice';

/**
 * Creates root reducer by combining reducers.
 * Accepts array of modules and and extra reducers object.
 *
 * @param {array} modules Array of modules created using `createModule`
 * @param {object} others Object of extra reducers not created by saga-slice
 *
 * @returns {object} Redux combined reducers
 *
 * @example
 *
 * const store = createStore(
 *     rootReducer(reduxModules, extraReducers),
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
