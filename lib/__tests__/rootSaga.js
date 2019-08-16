import { rootSaga } from '../rootSaga';
import { isGenerator } from "../util";

test('should not accept bad arguments', () => {

    [
        [undefined],
        [false],
        [{}],
        ["asd"],
        [12]
    ].forEach(args => {

        expect(() => rootSaga(...args)).toThrow();
    });

    expect(() => rootSaga([1,2,3])).toThrow(/should be a saga slice/);
});

test('should return a generator function when passed valid arguments', () => {

    expect(isGenerator(rootSaga([]))).toBe(true);
});
