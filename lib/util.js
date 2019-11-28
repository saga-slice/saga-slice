
export const isTrueObject = val => val.constructor === Object;
export const isArray = val => val.constructor === Array;
export const isFunction = fn => fn instanceof Function;
export const isGenerator = fn => fn.constructor.name === 'GeneratorFunction';
export const genName = (name, key) => `${name}/${key}`;
export const assert = (cond, message) => {
    if (!cond) throw Error(message);
}
export const areGenerators = arr => {

    assert(isArray(arr), 'modules must be an array');

    arr.forEach((i) => {

        assert(isGenerator(i), `saga must be a generator function`);
    });
};