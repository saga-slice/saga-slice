interface SagaObject {
    (...args: any): void,
    saga: void,
    taker?: any
}

interface RequiredModuleOpts {
    name: string,
    initialState: {
        [key: string]: any
    },
    reducers: {
        [key: string]: () => any
    }
}

interface OptionalModuleOpts {
    sagas?: (actions: object) => {
        [type: string]: SagaObject
    },
    takers?: {
        [type: string]: void
    }
};

interface ModuleOpts extends Required<RequiredModuleOpts>, OptionalModuleOpts {}

interface OptsExtracts {
    actions: {
        [key: string]: any
    },
    reducers: {
        [key: string]: any
    }
};

interface ReduxAction {
    type: string,
    payload: any
};

interface SagaSlice {

    name: string,
    actions: {
        [key: string]: () => any
    },
    reducer: (state: any, action: ReduxAction) => any,
    sagas: Iterable<any>[]
}