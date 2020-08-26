---
description: Detailed description of createModule helper
---

# createModule

## createModule: \(opts: ModuleOpts\) =&gt; SagaSlice

The secret sauce for saga-slice is the `createModule` helper. It brings together `types`,  `actions`, `reducers` and `sagas` into 1 file, dramatically reducing the amount of boilerplate needed to create an object store.  At the simplest level, this can be used to manage your redux state; but if you wanted to add asynchronous functionality and deal with side-effects, you can also add sagas to the same file.

## **Sample usage**

```javascript
import { createModule } from 'saga-slice';

export default createModule({
    name: 'todos',
    intialState: { /* ... */ },
    reducers: { /* ... */ },
    sagas: { /* ... */ }, // optional
    takers: { /* ... */ }, // optional
});
// Returns:
// {
//     name: 'todos',
//     actions: {/* ... */},
//     sagas: [/* ... */]
//     reducer: /* ... */
// }
```

## **How it works**

* When you create your saga slice, every reducer you create generates a subsequent `type` and `action`. 
* Types are created in the format of`{name}/{key}` where `name` is derived from `opts.name` and `type` is the key name defined in reducer object. 
* Reducers is a map of key/value pairs where key is used to generate types, and value is a reducer function. 
  * Reducer functions have the signature `(state, payload) => {}` , where `state` is clone of the current state, which can be directly manipulated, and `payload` is the data that was dispatched into the action. 
  * These functions are essentially [immer producers](https://immerjs.github.io/immer/docs/produce). 
  * The way that you manipulate the state is by hoisting to the object directly. There is no need to return anything. You can minimally pass an empty function to simply declare a type and action.

Take this example:

```javascript
const slice = createModule({
    name: 'todos',
    // ...
    reducers: {
        randomAction: () => {}
    }
});
```

This would generate `slice.actions.randomAction` and the `todos/randomAction` type, which would be dispatched using the action function:

```javascript
const action = slice.actions.randomAction({ test: true });
// Returns:
// {
//     type: 'todos/randomAction',
//     payload: { test: true }
// }

dispatch(action)
```

Because we did not tell the reducer to manipulate the state in any way, this would do nothing but serve as a way to create types and actions; however, if we wanted to do something with what we passed into the action, we could do the following:

```javascript
const slice = createModule({
    name: 'todos',
    initialState: {},
    reducers: {
        randomAction: (state, payload) => {
            state.results = payload;
        }
    }
});

console.log(getState().todos);
// Returns:
// {}

dispatch(slice.actions.randomAction({ test: true }));

console.log(getState().todos);
// Returns:
// {
//     results: { 
//         test: true 
//     }
// }
```

## Options

| Option Name | Required | Data Type | Description |
| :--- | :--- | :--- | :--- |
| name | yes | string | Name used to identify reducer in the global state and format redux types. |
| initialState | yes | object | The initial reducer state |
| [reducers](createmodule.md#how-it-works) | yes | object | Map of reducers. Object values must be functions. |
| [sagas](createmodule.md#sagas) | no | function | Sagas function `(actions: any) => { [key: string]: SagaObject }` |
| [takers](createmodule.md#takers) | no | object \| string \| generator | Takers to be used. Can be a string that names a redux saga taker such as `takeLatest`. Can also be a generator function or map of `{ reducerName: takeLatest }` or `{ takeLatest: ['reducerName'] }`. |

### **Actions Map**

The resulting object from a `createModule` has an `actions` property which is a map of functions to dispatch redux actions. Action functions have a `type` property which returns the generated type. Take the following example:

```javascript
const slice = createModule({
    name: 'todos',
    initialState: {},
    reducers: {
        create: () => {},
        read: () => {},
        update: () => {},
        delete: () => {}
    }
});
```

`slice.actions` would have the following:

```javascript
slice.actions.create.type;
// todos/create'

slice.actions.create();
// Returns:
// {
//     type: 'todos/create',
//     payload: undefined
// }

slice.actions.read.type;
// todos/read'

slice.actions.read();
// Returns:
// {
//     type: 'todos/read',
//     payload: undefined
// }

slice.actions.update.type;
// todos/update'

slice.actions.update();
// Returns:
// {
//     type: 'todos/update',
//     payload: undefined
// }

slice.actions.delete.type;
// todos/delete'

slice.actions.delete();
// Returns:
// {
//     type: 'todos/delete',
//     payload: undefined
// }
```

### Sagas

Finally, we can define sagas. This entire section assumes that you have a basic understand of redux sagas. The sagas option is a function with the signature `(actions) => ({})`. The returned value should be an object of key value pairs where keys are action types to be passed into redux saga effects, and value is either a generator function or configuration object. This option is the only option not required for creating a saga-slice module.

{% hint style="info" %}
#### Meta programming ahead:

In the following example, you will notice a strange implementation that will not immediately make sense unless you understand the magic behind it.

Javascript is quirky and allows us to do weird things. Sometimes that's a good thing and we can do things like:

```javascript
function xyz () {}

const x = { [xyz]: true };

console.log(x);
// > { 'function xyz () {}': true }
```

This happens because `xyz.toString()` generates the string `'function xyz () {}'`, and javascript coerces types into string in order to successfully create an object. We leverage this behavior for the creation of our saga configuration object.
{% endhint %}

```javascript
const slice = createModule({
    name: 'todos',
    initialState: {},
    reducers: {
        fetch: (state) => {
            state.isLoading = true;
        },
        fetchSuccess: (state, payload) => {
            state.isLoading = false;
            state.data = payload;
        },
        fetchFail: () => {
            state.isLoading = false;
        },
        fetchDone: () => {}
    },
    sagas: (actions) => {
        return {
            [actions.fetch]: {
                saga: function* () {
                    try {
                        const { data } = yield axios.get('/todos');
                        yield put(actions.fetchSuccess(data));
                    }
                    catch (e) {
                        yield put(actions.fetchFail(e));
                    }
    
                    yield put(actions.fetchDone());
                },
                taker: takeEvery
            },
            [actions.fetchSuccess]: function* ({ payload: data }) {
                alert('successfully fetched ' + data.length + 'todos');
                yield;
            },
            [actions.fetchFail]: function* ({ payload: error }) {
                alert('oh no! failed to fetch todos!');
                console.log(error);
                yield;
            },
            [actions.fetchDone]: function* () {
                alert('fetching todos is completed!');
                yield;
            }
        }
    }
});
```

_**.... wait... what?**_

Let's take it step by step by addressing the meta programming:

Under the hood, when actions are created, certain builtins are overwritten. In particular, the default `Function.prototype.toString` is overwritten for actions to always return its type. Essentially, `actions.fetch.type` is the same as `actions.fetch.toString()`. The latter is added for the convenience of using our actions as both keys and functions. 

Theoretical example:

```javascript
const hypothesis = (actions) => ({
    [actions.fetch]: true,
    [actions.fetchSuccess]: true,
    [actions.fetchFail]: true,
    [actions.fetchDone]:   true  
})

console.log(hypothesis(sagaSlice.actions));
// > {
//     'todos/create': true,
//     'todos/read': true,
//     'todos/update': true,
//     'todos/delete': true
// }
```

You could technically also do:

```javascript
(actions) => {
    [actions.fetch.type]: function* () {},
}

// OR

(actions) => {
    'todos/create': function* () {},
}
```

Really, whatever you feel comfortable with. The convenience of passing the action function is there so that you don't have to guess or potentially misspell the action types while you're writing sagas.

Next, let's address the saga configuration object. A saga config can either be a generator function, or a config with a generator function and/or a taker. If the value is a generator function, the saga will be ran using the `takeEvery` effect.

_**Option A: Generator function**_

```javascript
const slice = createModule({
    // ...
    sagas: (actions) => ({
        // The value for this action is a generator function
        // `takeEvery` will be the default taker
        [actions.fetch]: function* () {}
    })
});
```

_**Option B: Config object**_

```javascript
const slice = createModule({
    // ...
    sagas: (actions) => ({
        
        // The value for this action is a config object
        [actions.fetch]: {

            // Define the generator function
            saga: function* () {},
            // Specify the taker
            taker: takeLatest
        }
    })
});
```

For option B, essentially, any taker that can follow the signature `function (type, saga)` can be used to run the saga. In the cases where a taker doesn't exactly match that signature, such as `debounce`, you can always bind it to fulfill that effect's required arity.

```text
// ...
[actions.fetch]: {
    saga: function* () {},
    taker: debounce.bind(debounce, 2000)
}
```

See [redux sagas API reference](https://redux-saga.js.org/docs/api/) for more details on what you can use.

### Takers

Takers can be declared as part of configuration options in a multitude of ways. This is good for setting the default taker for all you sagas, or setting a taker for one or many of your sagas. You can use it as follows:

```javascript
const slice = createModule({
    reducers: { ... },
    sagas: (actions) => ({
        [actions.fetch]: function* () {},
        [actions.fetchSuccess]: function* () {},
        [actions.fetchFail]: function* () {},
        ...
    }),
    
    // Apply takeLatest to all sagas
    takers: 'takeLatest',
    
    // OR
    // Apply takeLatest to some sagas
    takers: {
        takeLatest: ['fetch', 'fetchSuccess']
    },
    
    // OR
    // Apply custom takers
    takers: {
        fetch: throttle.bind(throttle, 1000),
        fetchSuccess: debounce.bind(debounce, 1000)
    }
});
```

#### Allowed non-custom takers

When `takers` option is a string, or when a value in `takers` is an array, you can only apply the following effects:

* `takeEvery`
* `takeLatest`
* `takeMaybe`
* `takeLeading`
* `debounce`
* `throttle`

The following are acceptable configuration options

```javascript
// string configs
takers: 'takeEvery'
takers: 'takeLeading'

// map with effects as keys
takers: {
    takeMaybe: ['fetch', 'success', 'fail'],
    takeLeading: ['add', 'remove', 'delete'],
}

// generator function config
takers: takeLatest
takers: takeLeading

// custom function config
takers: function* (...args) { /* ... do stuff */ }

// map of actions as keys
takers: {
    fetch: takeLatest,
    success: debounce.bind(debounce, 100),
    add: takeLeading
}
```



