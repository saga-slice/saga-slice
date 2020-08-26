# Types



**SagaObject**

```typescript
interface SagaObject {
    (...args: any): void;
    saga: void;
    taker?: any;
}
```

**ModuleOpts**

```typescript
interface ModuleOpts {

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

**SagaSlice**

```typescript
interface SagaSlice {
    name: string;
    actions: {
        [key: string]: () => any;
    };
    reducer: (state: any, action: ReduxAction) => any;
    sagas: Iterable<any>[];
}
```

