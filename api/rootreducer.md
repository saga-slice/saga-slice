---
description: Detailed description of rootReducer helper
---

# rootReducer

## rootReducer\(modules, others\)

Root reducer is a helper that facilitates creating a combined redux store. Under the hood it utilizes redux's `combineReducers` function. It also gives us the ability to add other reducers outside of saga-slice into the mix. 

Setting up the root reducer should be pretty straightforward:

```javascript
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from 'saga-slice';

import TodosSlice from './todos/sagaSlice.js';

// And add all of your saga slices into an array.
// This array can only contain saga-slices.
const modules = [
    TodosSlice
];

// You can optionally pass other reducers to this root
// reducer for cases where you have something outside the
// scope of saga-slice.
const appReducer = rootReducer(modules, {
    myExtraReducer: (state, action) => { /* do stuff */ }
});

const store = createStore(appReducer);

export default store;
```

