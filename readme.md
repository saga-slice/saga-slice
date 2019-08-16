# Saga Slice

Slicing away at redux boilerplate. Similar to `redux-starter-kit`, easier than `kea-saga`.


Table of Contents
=================

* [Peer Dependencies:](#peer-dependencies)
* [Quick Setup](#quick-setup)
* [API](#api)
    * [createModule({ ... })](#createmodule--)
    * [rootSaga([])](#rootsaga)
    * [rootReducer([])](#rootreducer)

#### Peer Dependencies:
- Redux
- Redux Sagas

## Quick Setup

Copy pasta for a quickstart using this library

`npm i --save saga-slice`

```js

import { rootSaga, rootReducer } from 'saga-slice';
import reduxModules from './reduxModules';


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer(reduxModules),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga(reduxModules));
```


## API
---

### `createModule({ ... })`

Creates a saga slice module

```js
const initialState = {
    isFetching: false,
    data: null,
    error: null
};

const sagaSliceModule = ReduxTool.createModule({
    name: 'todos', // required
    initialState, // required
    reducers: { // required

        // reducer key names are used as types
        fetchAll: (state) => {

            return {
                ...state,
                isFetching: true
            }
        },
        fetchSuccess: (state, data) => {

            return {
                ...state,
                data,
                isFetching: false
            }
        },
        fetchFail: (state, error) => {

            return {
                ...state,
                error,
                isFetching: false
            }
        },

        // create empty functions to use as types for sagas
        someOtherAction: () => {},
    },
    sagas: (A) => ({
        * [A.fetchAll]({ payload }) {

            try {

                const { data } = yield axios.get('/todos');
                yield put(A.fetchSuccess(data));
            }
            catch (e) {

                yield put(A.fetchFail(e));
            }
        }
    })
});

export const { actions } = sagaSliceModule;
export default sagaSliceModule;
```

---

### `rootSaga([])`

Creates a root saga

```js

const sagaSliceModules = [
    TodosModule,
    UserModule
];

const sagaMiddleware = createSagaMiddleware();

// Only accepts an array of saga slices
sagaMiddleware.run(rootSaga(sagaSliceModules));

```

---

### `rootReducer([])`

Creates a root reducer

```js

const sagaSliceModules = [
    TodosModule,
    UserModule
];


const store = createStore(
    // Only accepts an array of saga slices
    rootReducer(sagaSliceModules),
    applyMiddleware(sagaMiddleware)
);
```
