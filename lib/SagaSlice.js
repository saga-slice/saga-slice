import { areGenerators, isFunction, isArray, assert } from './util';


export default class SagaSlice {

    /**
     *
     * @param {Object} props
     * @param {String} props.name Reducer name.
     * @param {{string: Function}} props.actions Map of actions based on reducer map keys
     * @param {Generator} props.sagas A generator function that runs the defined sagas
     * @param {Function} props.reducer The component's main reducer
     */
    constructor(props) {

        assert(props.name, 'slice module must have a name');
        assert(props.actions, 'slice module must have actions');
        assert(isFunction(props.reducer), 'reducer must be a function');
        assert(isArray(props.sagas), 'sagas must be an array');

        Object.entries(props.actions).forEach(([k, a]) => {

            assert(typeof a === 'function', `${k} action must be a function`);
        });

        areGenerators(props.sagas);

        Object.assign(this, props);
    }
}

export const isSagaSlice = item => item instanceof SagaSlice;

export const areSagaSlices = arr => {

    assert(isArray(arr), 'modules must be an array');

    arr.forEach((i) => {

        assert(isSagaSlice(i), 'item should be a saga slice')
    });
};
