import { areSagaSlices } from './SagaSlice';
import { all } from 'redux-saga/effects';

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
export const rootSaga = function (modules) {

    areSagaSlices(modules);

    return function* () {

        yield all(
            modules
                .map(({ sagas }) => sagas)
                .reduce((a, c) => a.concat(c), [])
                .map((saga) => saga())
        );
    }
}
