import { rootReducer } from '../rootReducer';
import { createModule } from '../createModule';

const stub = {
    modConf: {
        name: 'rootreducer',
        reducers: {
            test: () => {}
        },
        initialState: { test: true }
    }
};

test('should not accept bad arguments', () => {

    [
        [undefined],
        [false],
        [{}],
        ["asd"],
        [12],
        [[], true],
        [[], "asd"],
        [[], 12],
    ].forEach(args => {

        expect(() => rootReducer(...args)).toThrow();
    });

    expect(() => rootReducer([1,2,3])).toThrow(/should be a saga slice/);
    expect(() => rootReducer([createModule(stub.modConf)], 1)).toThrow(/other.+be an object/);
});

test('should create a root reducer', () => {

    const mods = [
        createModule({
            ...stub.modConf,
            name: 'mod1'
        }),
        createModule({
            ...stub.modConf,
            name: 'mod2'
        }),
        createModule({
            ...stub.modConf,
            name: 'mod3'
        }),
    ];

    // stub reducers
    const others = {
        lala: () => ({}),
        lolo: () => ({})
    };

    const reducer = rootReducer(mods, others);

    expect(typeof reducer).toBe('function');

    const states = reducer({}, { type: 'la', payload: 'lo' });

    [
        'mod1',
        'mod2',
        'mod3',
        'lala',
        'lolo'
    ].forEach((key) => expect(states).toHaveProperty(key));

})