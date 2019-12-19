import { rootSaga } from '../rootSaga';

test('should return a generator function when passed valid arguments', () => {

    expect(typeof rootSaga([])).toBe('function');
});
