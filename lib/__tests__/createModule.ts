import { createModule } from '..';

const stub: { [key: string]: any } = {};

test('should not create a module with anything other than an object', () => {

    [
        [],
        "",
        123,
        false,
        null,
        undefined,
        () => {}
    ].forEach((opts: any) => {

        expect(() => createModule(opts)).toThrow();
    })
});

// test('should enforce required options', () => {

//     [
//         {},
//         { reducers: {}, initialState: {} },
//         { name: 'yep', initialState: 'yap' },
//         { name: 'yep', initialState: {}, reducers: 'yap' },
//         { name: 'yep', initialState: {}, reducers: {}, sagas: 'yap' },
//     ].forEach((opts: any) => {

//         expect(() => createModule(opts)).toThrow();
//     });
// });

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

    stub.modConf.sagas = (A: any) => ({

        * [A.test]() { yield; }
    });
    expect(() => createModule(stub.modConf)).not.toThrow();

    stub.modConf.sagas = (A: any) => ({

        [A.test]: function* () { yield; }
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
    stub.modConf.sagas = (A: any) => ({

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
