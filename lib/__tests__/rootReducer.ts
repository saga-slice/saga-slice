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

test('should create a root reducer', () => {

    const opts = { name: 'mod1', ...stub.modConf }

    const mods = [
        createModule(opts),
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