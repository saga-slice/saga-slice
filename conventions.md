---
description: Patterns that should be implemented using saga slice for best results
---

# Conventions

## Building apps can be messy

It's even messier with 4 boilerplate files, which is why saga-slice exists. Even then, things can still get messy, which is why this conventions page exists. Ultimately, we all do whatever we understand, but I have found that following a guideline increases focus and reduces entropy quite a bit.

I have seen 2 common sense patterns implemented in redux which are formidable:

* Pattern A: implement the conventions suggested by the official redux guides
* Pattern B: create all redux stuff inside of a corresponding component folder

**Pattern A: Official redux convention**

```diff
├── actions
│   ├── cats.js
│   ├── todos.js
│   └── users.js
├── components
│   ├── cats
│   │   ├── Form.jsx
│   │   └── ViewAll.jsx
│   ├── todos
│   │   ├── Form.jsx
│   │   └── ViewAll.jsx
│   └── users
│       ├── Form.jsx
│       └── ViewAll.jsx
├── constants
│   ├── cats.js
│   ├── todos.js
│   └── users.js
├── reducers
│   ├── cats.js
│   ├── index.js
│   ├── todos.js
│   └── users.js
└── index.js
```

**Pattern B: Component scoped convention**

```text
├── components
│   ├── cats
│   │   ├── Form.jsx
│   │   ├── ViewAll.jsx
│   │   ├── actions.js
│   │   ├── constants.js
│   │   └── reducer.js
│   ├── todos
│   │   ├── Form.jsx
│   │   ├── ViewAll.jsx
│   │   ├── actions.js
│   │   ├── constants.js
│   │   └── reducer.js
│   └── users
│       ├── Form.jsx
│       ├── ViewAll.jsx
│       ├── actions.js
│       ├── constants.js
│       └── reducer.js
└── index.js
```

Both ways work to organize the code and are fine. Similarly, we would apply the same structure to saga slices:

**Pattern A:**

```diff
- ├── actions
  ├── components
  │   ├── cats
  │   │   ├── Form.jsx
  │   │   └── ViewAll.jsx
  │   ├── todos
  │   │   ├── Form.jsx
  │   │   └── ViewAll.jsx
  │   └── users
  │       ├── Form.jsx
  │       └── ViewAll.jsx
- ├── constants
- ├── reducers
+ ├── modules
+ │   ├── index.js
+ │   ├── cats.js
+ │   ├── todos.js
+ │   └── users.js
  ├── index.js
+ └── store.js
```

**Pattern B:**

```diff
  ├── components
  │   ├── cats
  │   │   ├── Form.jsx
  │   │   ├── ViewAll.jsx
- │   │   ├── actions.js
- │   │   ├── constants.js
- │   │   ├── reducer.js
+ │   │   └── sagaSlice.js
  │   ├── todos
  │   │   ├── Form.jsx
  │   │   ├── ViewAll.jsx
- │   │   ├── actions.js
- │   │   ├── constants.js
- │   │   ├── reducer.js
+ │   │   └── sagaSlice.js
  │   └── users
  │       ├── Form.jsx
  │       ├── ViewAll.jsx
- │       ├── actions.js
- │       ├── constants.js
- │       ├── reducer.js
+ │       └── sagaSlice.js
  ├── index.js
+ ├── modules.js
+ └── store.js
```

In either case, we should consider separating store config, react config, and module declaration so we can leave the particularities of each inside its own node module. What that means is:

 **Pattern A `./modules/index.js`  or Pattern B `./modules.js`**

Both should only worry about importing the saga slice modules and not couple store instantiation logic inside of here. This allows for this file to be the source of truth for declaring saga slices. It can grow as much as it needs to without logic clutter.

```javascript
// modules/index.js
import CatsSlice from './cats'
import UsersSlice from './users'
import TodosSlice from './todos'

// modules.js
import CatsSlice from './cats/components/sagaSlice'
import UsersSlice from './users/components/sagaSlice'
import TodosSlice from './todos/components/sagaSlice'

// both
export default [
    CatsSlice,
    UsersSlice,
    TodosSlice
];
```

**File `./store.js`**

This file should only contain all the logic relating to redux instantiation. This means that it should not be coupled with react logic at all. The reasoning for this is because code can get messy when wiring up your redux store, and it can get equally as messy for wiring up react initialization.

```javascript
import { createStore, applyMiddleware, compose } from 'redux';

import createSagaMiddleware from 'redux-saga';
import { connectRouter } from 'connected-react-router';

import { rootSaga, rootReducer } from 'saga-slice';

// This is where you would bring in your array of saga slices or any other
// map of extra reducers.
import reduxModules from './modules';

import history from './utils/history';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    rootReducer(reduxModules, {

        // Extra reducers
        router: connectRouter(history)
    }),
    composeEnhancers(applyMiddleware(sagaMiddleware))
);

export const { getState, dispatch, subscribe } = store;

sagaMiddleware.run(rootSaga(reduxModules));

export default store;
```

**File `./index.js`**

This file should be focused on the logic relating to react initialization. This includes any routing you might want to implement if that's a thing in this file, etc.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import './index.scss';

import App from './App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import history from './utils/history';

export const AppWrapper = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(AppWrapper, document.getElementById('root'));

serviceWorker.register();
```



In conclusion, I sincerely hope you understand the reasoning behind these suggested conventions. We want to keep our code base focused, organized, and scalable.

