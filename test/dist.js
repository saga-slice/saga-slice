const assert = require('assert');
const chalk = require('chalk');
const { createStore } = require('redux');
const { rootReducer, createModule } = require('../dist');

const stub = {
    exit: 0
};

const test = (msg, fn) => {

    try {
        assert.doesNotThrow(fn);
        console.log(chalk.green(`> ${msg}`));
    }
    catch (e) {

        console.log(chalk.red(`> ${msg}`));
        console.log(chalk.yellow('-----------------------'));
        console.log(chalk.red(e));
        console.log(chalk.yellow('-----------------------'));
        stub.exit = 1;
    }

    console.log('');
};

test('it exports default and commonjs', () => {

    const mod = require('../dist');

    assert.equal(mod.default.createModule, createModule);
    assert.equal(mod.createModule, createModule);
})

test('create module does not throw', () => {

    stub.slice = createModule({
        name: 'testz',
        initialState: {},
        reducers: { icles: (state) => { state.icles = true; } }
    });

    stub.store = createStore(
        rootReducer([stub.slice])
    );
});

test('reducers successfully uses immer', () => {

    const { dispatch, getState } = stub.store;

    dispatch(stub.slice.actions.icles());
    const state = getState();

    assert.equal(state.testz.icles, true);
});


process.exit(stub.exit);