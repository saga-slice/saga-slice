---
description: Get up and running with saga slices quickly
---

# Getting Started

## What it is

Saga slice is an abstraction on top of redux and sagas meant to help reduce boilerplate around Redux. It uses `immer` to implement immutability. In a normal redux project with sagas, you typically have 4 files that you would need to keep track of: `types.js`, `reducers.js`, `actions.js`, and `sagas.js`. With saga slice, you only have to manage 1 file: `sagaSlice.js`

## Getting Started

Setup a new react project, install saga slice and its dependencies:

```javascript
// Create a react app if you don't already have one
npx create-react-app myApp
cd myApp

// Install saga slice and dependencies
npm i --save redux redux-saga immer saga-slice
```

Next, we're going to create a sample slice reducer

`./todos/sagaSlice.js`

```javascript
import { put, select, takeLatest } from "redux-saga/effects";
import { createModule } from 'saga-slice';

const sagaSlice =  createModule({

    // Key name that gets added to combineReducers
    name: 'todos',
    initialState: {
        isFetching: false,
        data: null,
        error: null,
        shouldRunOnce: 0
    },
    
    // Reducers object is the bread and butter of saga slice.
    // Defining a reducer also defines a type and action.
    // The type will be `todos/fetch`, using the pattern of `{name}/{key}`
    reducers: {
        fetch: (state) => {
            state.isFetching = true;
        },
        fetchSuccess: (state, payload) => {
            state.isFetching = false;
            state.data = payload;
        },
        fetchFail: (state, payload) => {
            state.isFetching = false;
            state.error = payload;
        }
    },
    
    // The sagas option is a function that gets passed the Actions object.
    // Actions are converted into strings which are the value of its
    // corresponding type. You can also use the actions object to dispatch
    // actions from sagas using the `put` effect.
    sagas: (A) => ({
        *[A.fetch]({ payload }) {
            try {
                const { data } = yield.axios.get('/todos');
                yield put(A.fetchSuccess(data));
            }
            catch (e) {
                yield put(A.fetchFail(data));
            }
        }
    })
});

// Export actions for convenience when importing from other modules
export const { actions } = sagaSlice;
export default sagaSlice;
```

Finally, we're going to bring it all in using some other helpers provided by saga slice

`./store.js`

```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSaga, rootReducer } from 'saga-slice';

// Bring in all of your saga slices together in whatever file
// you're going to declare your redux store
import TodosSlice from './todos/sagaSlice.js';

// And add all of your saga slices into an array
const modules = [
    TodosSlice
];

const sagaMiddleware = createSagaMiddleware();

// Use the `rootReducer` helper function to create a
// main reducer out of the array of saga-slice modules.
// You can optionally pass other reducers to this root
// reducer for cases where you have something outside the
// scope of saga-slice
const appReducer = rootReducer(modules, {
    myExtraReducer: (state, action) => { /* do stuff */ }
});

// Typicaly redux middleware
const middleware = applyMiddleware(...[
    sagaMiddleware,
    /* redux dev tools, etc*/
])

const store = createStore(appReducer, middleware);

// Use the `rootSaga` helper function to create a generator function 
// which will instantiate all sagas using the `*all()` effect based
// on the saga-slice modules array
sagaMiddleware.run(rootSaga(modules));

export default store;
```

And that's it! You're ready to start using saga slices in your app.

