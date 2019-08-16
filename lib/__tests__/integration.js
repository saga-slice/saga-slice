import { put, select, takeLatest } from "redux-saga/effects";
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootSaga, rootReducer, createModule } from '../..';

const wait = time => new Promise((resolve) => {

    setTimeout(resolve, time);
});

const asyncFetch = ({ fail, response, payload }) => new Promise((res, rej) => {

    if (fail) {

        stub.asyncError && stub.asyncError(payload);
        rej(Error(response));
        return;
    }

    stub.asyncSuccess && stub.asyncSuccess(payload);
    res(response);
});

const crudReducers = {
    fetch: (state) => ({
        ...state,
        isFetching: true
    }),
    fetchSuccess: (state, payload) => ({
        ...state,
        isFetching: false,
        data: payload
    }),
    fetchFail: (state, payload) => ({
        ...state,
        isFetching: false,
        error: payload
    }),
    shouldTakeLatest: (state) => state,
    shouldRunOnce: (state) => ({
        ...state,
        shouldRunOnce: state.shouldRunOnce + 1
    }),
};

const crudSagas = (name) => (A) => ({

    * [A.fetch]({ payload }) {

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
    }
});

const stub = {
    todos: {
        name: 'todos',
        initialState: {
            isFetching: false,
            data: null,
            error: null,
            shouldRunOnce: 0
        },
        reducers: { ...crudReducers },
        sagas: crudSagas('todos')
    },
    users: {
        name: 'users',
        initialState: {
            isFetching: false,
            data: null,
            error: null
        },
        reducers: { ...crudReducers },
        sagas: crudSagas('users')
    }
}

test('should create reducers with sagas', () => {

    const todos = createModule(stub.todos);
    const users = createModule(stub.users);

    stub.mods = [todos, users];

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

    stub.asyncSuccess = jest.fn();
    stub.store.dispatch(todos.actions.fetch());

    const newState = stub.store.getState();

    expect(newState.todos).toHaveProperty('isFetching', true);
    expect(newState.users).toHaveProperty('isFetching', false);

    expect(stub.asyncSuccess.mock.calls.length).toBe(1);

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
