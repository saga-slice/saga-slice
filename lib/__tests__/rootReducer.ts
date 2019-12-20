import { rootReducer, createModule } from '..';

const stub = {
    modConf: {
        name: 'rootreducer',
        reducers: {
            test: () => {}
        },
        initialState: { test: true }
    }
};

test('should create a root reducer', () => {

    const opts1 = { ...stub.modConf, name: 'mod1' }
    const opts2 = { ...stub.modConf, name: 'mod2' }
    const opts3 = { ...stub.modConf, name: 'mod3' }

    const mods = [
        createModule(opts1),
        createModule(opts2),
        createModule(opts3),
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