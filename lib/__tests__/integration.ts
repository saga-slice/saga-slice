import { put, select, takeLatest, debounce, throttle } from "redux-saga/effects";
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootSaga, rootReducer, createModule } from '..';

const wait = (time: any) => new Promise((resolve) => {

    setTimeout(resolve, time);
});

// const time = () => {
//     const now = new Date();
//     return([
//         now.getHours(),
//         now.getMinutes(),
//         now.getSeconds(),
//         now.getMilliseconds(),
//     ].join(':'));
// };

const asyncFetch = (opts: { [key: string]: any }) => new Promise((res, rej) => {

    const { fail, response, payload } = opts;

    if (fail) {

        stub.asyncError && stub.asyncError(payload);
        rej(Error(response));
        return;
    }

    stub.asyncSuccess && stub.asyncSuccess(payload);
    res(response);
});

const crudReducers = {
    fetch: (state: any) => {

        state.isFetching = true;
    },
    fetchSuccess: (state: any, payload: any) => {

        state.isFetching = false;
        state.data = payload;
    },
    fetchFail: (state: any, payload: any) => {

        state.isFetching = false;
        state.error = payload;
    },
    shouldTakeLatest: (state: any) => state,
    shouldRunOnce: (state: any) => {

        state.shouldRunOnce += 1;
    },
    shouldThrottle: (state: any) => state,
    didThrottle: (state: any) => {

        state.throttled += 1;
    },
    shouldDebounce: (state: any) => state,
    didDebounce: (state: any) => {

        state.debounced += 1;
    }
};

const crudSagas = (name: any) => (A: any) => ({

    * [A.fetch](action: any) {

        const { payload } = action;
        const { isFetching } = yield select(state => state[name]);

        expect(isFetching).toBe(true);

        try {
            const response = yield asyncFetch({
                payload,
                fail: stub.fail,
                response: stub.fail ? 'crudfail' : { success: true }
            });

            yield put(A.fetchSuccess(response));
        }
        catch (e) {


            yield put(A.fetchFail(e.message));
        }
    },
    [A.shouldTakeLatest]: {
        saga: function* () {

            yield wait(10);
            stub.asyncSuccess && stub.asyncSuccess();
            yield put(A.shouldRunOnce());
        },
        taker: takeLatest
    },
    [A.shouldThrottle]: function* () {

        yield wait(50);
        yield put(A.didThrottle());
    },
    [A.shouldDebounce]: function* () {

        yield wait(50);
        yield put(A.didDebounce());
    }
});

const conf = (name: string, state: any, takers: any): any => {

    return {
        name,
        initialState: {
            isFetching: false,
            data: null,
            error: null,
            ...state
        },
        reducers: { ...crudReducers },
        takers,
        sagas: crudSagas(name)
    }
}

const stub: { [key: string]: any } = {
    todos: conf(
        'todos',
        {
            shouldRunOnce: 0,
            throttled: 0
        },
        {
            shouldThrottle: throttle.bind(throttle, 100)
        }
    ),
    users: conf('users', {}, null),
    takes: conf(
        'takes',
        {
            debounced: 0,
            throttled: 0
        },
        debounce.bind(debounce, 50)
    ),
    ticks: conf(
        'ticks',
        {
            debounced: 0,
            throttled: 0
        },
        'takeLatest'
    ),
}

test('should create reducers with sagas', () => {

    const todos = createModule(stub.todos);
    const users = createModule(stub.users);
    const takes = createModule(stub.takes);
    const ticks = createModule(stub.ticks);

    stub.mods = [todos, users, takes, ticks];

    stub.rootSaga = rootSaga(stub.mods);
    stub.rootReducer = rootReducer(stub.mods);

    stub.sagaMiddleware = createSagaMiddleware();

    stub.store = createStore(
        stub.rootReducer,
        applyMiddleware(stub.sagaMiddleware)
    );

    stub.sagaMiddleware.run(stub.rootSaga);
});

test('should run fetch saga and succeed for one reducer', () => {

    const [todos] = stub.mods;

    stub.oldState = stub.store.getState();

    stub.asyncSuccess = jest.fn();
    stub.store.dispatch(todos.actions.fetch());

    const newState = stub.store.getState();

    expect(newState.todos).toHaveProperty('isFetching', true);
    expect(newState.users).toHaveProperty('isFetching', false);

    expect(stub.asyncSuccess.mock.calls.length).toBe(1);

});

test('should have immutable state', () => {

    expect(stub.oldState.todos).toHaveProperty('isFetching', false);
    const newState = stub.store.getState();

    expect(stub.oldState.todos === newState.todos).toBe(false);
    expect(stub.oldState === newState).toBe(false);
});

test('should have ran fetchSuccess action for todos', () => {

    const afterAsyncState = stub.store.getState();

    expect(afterAsyncState.todos).toHaveProperty('isFetching', false);
    expect(afterAsyncState.todos).toHaveProperty('data', expect.any(Object));
    expect(afterAsyncState.todos).toHaveProperty('error', null);

});

test('should run fetch saga and fail for one reducer', () => {

    const [todos] = stub.mods;
    stub.fail = true;

    stub.asyncError = jest.fn();
    stub.store.dispatch(todos.actions.fetch());

    const newState = stub.store.getState();
    expect(newState.todos).toHaveProperty('isFetching', true);
    expect(stub.asyncError.mock.calls.length).toBe(1);
});

test('should run have ran fetchFail action for todos', () => {

    const afterAsyncState = stub.store.getState();

    expect(afterAsyncState.todos).toHaveProperty('isFetching', false);
    expect(afterAsyncState.todos).toHaveProperty('error', 'crudfail');
});

test('should accept a custom saga taker config', async () => {

    const [todos] = stub.mods;

    stub.asyncSuccess = jest.fn();
    stub.store.dispatch(todos.actions.shouldTakeLatest());
    stub.store.dispatch(todos.actions.shouldTakeLatest());
    stub.store.dispatch(todos.actions.shouldTakeLatest());
    stub.store.dispatch(todos.actions.shouldTakeLatest());
    stub.store.dispatch(todos.actions.shouldTakeLatest());

    await wait(15);

    const { shouldRunOnce } = stub.store.getState().todos;

    expect(stub.asyncSuccess.mock.calls.length).toBe(1);
    expect(shouldRunOnce).toBe(1);
});

test('should accept a taker options config', async () => {

    const [todos] = stub.mods;

    stub.store.dispatch(todos.actions.shouldThrottle());
    await wait(10);
    stub.store.dispatch(todos.actions.shouldThrottle());
    await wait(10);
    stub.store.dispatch(todos.actions.shouldThrottle());
    await wait(100);


    let throttled = stub.store.getState().todos.throttled;

    expect(throttled).toBe(1);

    await wait(100);
    throttled = stub.store.getState().todos.throttled;
    expect(throttled).toBe(2);
});

test('should accept a taker effect config', async () => {

    const takes = stub.mods[2];
    stub.fail = false;

    // Test one function
    stub.asyncSuccess = jest.fn();
    stub.store.dispatch(takes.actions.fetch());
    await wait(10);
    stub.store.dispatch(takes.actions.fetch());
    await wait(10);
    stub.store.dispatch(takes.actions.fetch());

    expect(stub.asyncSuccess.mock.calls.length).toBe(0);
    await wait(50);
    expect(stub.asyncSuccess.mock.calls.length).toBe(1);


    // Test another function
    stub.store.dispatch(takes.actions.shouldDebounce());
    await wait(105);
    stub.store.dispatch(takes.actions.shouldDebounce());
    await wait(10);
    stub.store.dispatch(takes.actions.shouldDebounce());
    await wait(10);


    let debounced = stub.store.getState().takes.debounced;

    expect(debounced).toBe(1);

    await wait(100);
    debounced = stub.store.getState().takes.debounced;
    expect(debounced).toBe(2);
});


test('should accept a taker function config', async () => {

    const ticks = stub.mods[3];

    // Test one function
    stub.store.dispatch(ticks.actions.shouldThrottle());
    stub.store.dispatch(ticks.actions.shouldThrottle());
    stub.store.dispatch(ticks.actions.shouldThrottle());

    let throttled = stub.store.getState().ticks.throttled;

    expect(throttled).toBe(0);

    await wait(100);
    throttled = stub.store.getState().ticks.throttled;
    expect(throttled).toBe(1);


    // Test another function
    stub.store.dispatch(ticks.actions.shouldDebounce());
    stub.store.dispatch(ticks.actions.shouldDebounce());
    stub.store.dispatch(ticks.actions.shouldDebounce());

    let debounced = stub.store.getState().ticks.debounced;

    expect(debounced).toBe(0);

    await wait(100);
    debounced = stub.store.getState().ticks.debounced;
    expect(debounced).toBe(1);
});

test('should created named actions', () => {

    const [todos, users] = stub.mods;

    const todoActions = todos.namedActions;
    const userActions = users.namedActions;

    expect(Object.keys(todoActions)).toContain("todosFetch");
    expect(Object.keys(todoActions)).toContain("todosFetchFail");
    expect(Object.keys(todoActions)).toContain("todosFetchSuccess");

    expect(Object.keys(userActions)).toContain("usersFetch");
    expect(Object.keys(userActions)).toContain("usersFetchFail");
    expect(Object.keys(userActions)).toContain("usersFetchSuccess");
});