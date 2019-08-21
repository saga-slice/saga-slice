import { createModule } from '../createModule';

const stub = {};

test('should not create a module with anything other than an object', () => {

    [
        [],
        "",
        123,
        false,
        null,
        undefined,
        () => {}
    ].forEach(opts => {

        expect(() => createModule(opts)).toThrow(/options.+must be.+object/);
    })
});

test('should enforce required options', () => {

    [
        {},
        { reducers: {}, initialState: {} }
    ].forEach(opts => {

        expect(() => createModule(opts)).toThrow(/name.+required/);
    });

    const name = 'nahmeh';

    expect(() => createModule({
        name,
        initialState: 'blyat'
    })).toThrow(/reducers.+required/);

    expect(() => createModule({
        name,
        reducers: {}
    })).toThrow(/initialState.+required/);


    const initialState = {};

    [
        [],
        "something",
        123,
        true,
        () => {}
    ].forEach(reducers => {

        expect(() => createModule({
            name,
            initialState,
            reducers
        })).toThrow(/reducers must be an object/);
    });

    const reducers = {};

    [
        [],
        "something",
        123,
        true,
        {}
    ].forEach(sagas => {

        expect(() => createModule({
            name,
            initialState,
            reducers,
            sagas
        })).toThrow(/sagas must be a function/);
    })
});

test('should accept a proper config', () => {

    stub.modConf = {
        name: 'works',
        initialState: { test: true },
        reducers: { test: () => {} }
    }

    expect(() => createModule(stub.modConf)).not.toThrow();
    stub.modConf.sagas = () => ({});

    expect(() => createModule(stub.modConf)).not.toThrow();
});

test('should accept a saga config with action as generator function', () => {

    stub.modConf = {
        name: 'works',
        initialState: { test: true },
        reducers: { test: () => {} }
    }

    expect(() => createModule(stub.modConf)).not.toThrow();
    stub.modConf.sagas = (A) => ({

        * [A.test]() { yield; }
    });

    expect(() => createModule(stub.modConf)).not.toThrow();
});

test('should accept a saga config with action as saga config', () => {

    stub.modConf = {
        name: 'works',
        initialState: { test: true },
        reducers: { test: () => {} }
    }

    expect(() => createModule(stub.modConf)).not.toThrow();
    stub.modConf.sagas = (A) => ({

        * [A.test]() { yield; }
    });

    expect(() => createModule(stub.modConf)).not.toThrow();
});

test('should return an object with actions and a reducer', () => {

    stub.mod = createModule(stub.modConf);

    ['actions', 'reducer'].forEach((prop) => {

        expect(stub.mod).toHaveProperty(prop);
    });

    expect(typeof stub.mod.actions).toBe('object');
    expect(typeof stub.mod.reducer).toBe('function');

});

test('should have actions mapped from reducers', () => {

    expect(stub.mod.actions).toHaveProperty('test');
    expect(typeof stub.mod.actions.test).toBe('function');
});

test('should create dispatch object from action', () => {

    const payload = 'mypayload';
    const action = stub.mod.actions.test(payload);
    expect(action).toHaveProperty('type', stub.modConf.name + '/test');
    expect(action).toHaveProperty('payload', payload);
});
