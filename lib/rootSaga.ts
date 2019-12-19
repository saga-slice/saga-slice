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
export const rootSaga = function (modules: SagaSlice[]) {

    return function* () {

        yield all(
            modules
                .map((slice) => slice.sagas)
                .reduce((a, c: any) => a.concat(c), [])
                .map((saga: any) => saga())
        );
    }
}
