# Saga Slice

Slicing away at redux boilerplate. Similar to `redux-starter-kit`, easier than `kea-saga`.
Full documentation [available here](https://miami-dev-shop.gitbook.io/saga-slice/)

Table of Contents
=================

* [Peer Dependencies:](#peer-dependencies)
* [Quick Setup](#quick-setup)
* [API](#api)
    * [createModule](#createmodule-opts-moduleopts--sagaslice)
    * [rootSaga](#rootsaga-modules-sagaslice----generator)
    * [rootReducer](#rootreducer-modules-sagaslice-others-object--any)
* [Types](#types)
    * [SagaObject](#sagaobject)
    * [ModuleOpts](#moduleopts)
    * [SagaSlice](#sagaslice)



#### Peer Dependencies:
- [Redux](https://redux.js.org)
- [Redux Sagas](https://redux-saga.js.org/)
- [Immer](https://github.com/immerjs/immer)

## Quick Setup

Copy pasta for a quickstart using this library

`npm i --save saga-slice`

```js

import { rootSaga, rootReducer } from 'saga-slice';
import sagaSliceModules from './sagaSliceModules';


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer(sagaSliceModules),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga(sagaSliceModules));
```


## API
---

#### `createModule: (opts: ModuleOpts) => SagaSlice;`

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
        // reducers use `immer` to provide immutability
        fetchAll: (state) => {

            state.isFetching = true;
        },
        fetchSuccess: (state, data) => {

            state.isFetching = false;
            state.data = data;
        },
        fetchFail: (state, error) => {

            state.isFetching = false;
            state.error = error;
        },

        // create empty functions to use as types for sagas
        someOtherAction: () => {},
    },

    // Optionally override taker
    takers: {
        fetchAll: takeLatest,

        // can also pass taker as key with array of types
        // taker must exist in redux-saga effects
        takeLeading: ['fetchAll', 'fetchSuccess']
    },

    // Or apply default effect to all
    takers: 'takeLatest' || 'takeLeading',

    // Or apply a custom effect to all
    takers: throttle.bind(throttle, 1000),

    // Sagas must be an object. `A` in this context is a map of
    // all actions. For every reducer, there is an action to dispatch.
    sagas: (A) => ({

        // This is considered a valid SagaObject
        * [A.fetchAll]({ payload }) {

            try {

                const { data } = yield axios.get('/todos');

                // dispatch module actions using `A`
                yield put(A.fetchSuccess(data));
            }
            catch (e) {

                yield put(A.fetchFail(e));
            }
        },

        // Also considered a valid SagaObject
        [A.fetchFail]: {
            saga: function* () {},
            taker: takeLatest
        },

        // Also considered a valid SagaObject
        [A.fetchFail]: {
            * saga () {},
            taker: takeLatest
        },

        // Also considered a valid SagaObject
        [A.fetchFail]: function* () {},
    })
});

// Slice module creates a map of functions that produce redux actions
// with their respective function, as per keys in reducer
export const { actions } = sagaSliceModule;
export default sagaSliceModule;
```

In this example, `sagaSliceModule` would create the following actions:

```js
actions.fetchAll()
// { type: 'todos/fetchAll', payload: undefined }

actions.fetchSuccess(data)
// { type: 'todos/fetchSuccess', payload: { status: 200, ... } }

actions.fetchFail(errorMessage)
// { type: 'todos/fetchFail', payload: "oopsies" }
```

---

#### `rootSaga: (modules: SagaSlice[]) => () => Generator`

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

#### `rootReducer: (modules: SagaSlice[], others?: object) => any`

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

## Types

#### `SagaObject`

```ts
interface SagaObject {
    (...args: any): void;
    saga: void;
    taker?: any;
}
```

#### `ModuleOpts`

```ts
ModuleOpts {

    name: string;
    initialState: {
        [key: string]: any;
    };
    reducers: {
        [key: string]: () => any;
    };
    sagas?: (actions: object) => {
        [type: string]: SagaObject;
    };
    takers?: {
        [type: string]: void;
    };
}
```

#### `SagaSlice`

```ts
interface SagaSlice {
    name: string;
    actions: {
        [key: string]: () => any;
    };
    reducer: (state: any, action: ReduxAction) => any;
    sagas: Iterable<any>[];
}
```
