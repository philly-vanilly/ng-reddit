import { cold } from 'jasmine-marbles';
import { incrementalHttpRetry } from './incremantal-http-retry';

describe('incrementalHttpRetry', () => {
  it('only errors => should return the original input', () => {
    const values = { a: () => Math.random() > 0.5 ? new Error() : 'something'};
    const source = cold('-a-a-a-|', values);
    const result = source.pipe(incrementalHttpRetry(1, 5));
    expect(result).toBeObservable(source);
  });
});
