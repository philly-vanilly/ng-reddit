import { delay, flatMap, retryWhen, take } from 'rxjs/operators';
import { of, OperatorFunction } from 'rxjs';

export const incrementalHttpRetry = (delayArg: number = 500, numberOfRetries: number = 5): OperatorFunction<any, any> => {
  return retryWhen(errors => {
    let delayTime = delayArg;
    return errors.pipe(
      flatMap((error: any) => {
        delayTime = delayTime * 2;
        return of(error.status).pipe(delay(delayTime));
      }),
      take(numberOfRetries)
    );
  });
};
