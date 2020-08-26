---
description: Detailed description of rootSaga helper
---

# rootSaga

## rootSaga\(modules\)

Root saga is a helper that facilitates running all your module's sagas. 

Setting up the root reducer should be pretty straightforward and is the same as what you saw in the [Getting Started](../) page:

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

// Typicaly redux middleware
const middleware = applyMiddleware(...[
    sagaMiddleware,
    /* redux dev tools, etc*/
])

// Implement root reducer
const store = createStore(rootReducer(modules), middleware);

// Implement root saga
sagaMiddleware.run(rootSaga(modules));

export default store;
```

