import { cold } from 'jasmine-marbles';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { incrementalHttpRetry } from './incremantal-http-retry';

@Injectable()
class IncrementalHttpRetryTestService {
  constructor(private http: HttpClient) { }

  performHttpRequest(): Observable<any> {
    return this.http.get<any>('http://example.com');
  }
}

describe('incrementalHttpRetry', () => {
  let httpMock: HttpTestingController;
  let httpService: IncrementalHttpRetryTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [IncrementalHttpRetryTestService] });
    httpMock = TestBed.get(HttpTestingController);
    httpService = TestBed.get(IncrementalHttpRetryTestService);
  });

  it('no error => should return http-response', done => {
    const expectedRes = {foo: 'bar'};
    httpService.performHttpRequest()
      .pipe(incrementalHttpRetry(0, 5))
      .subscribe((res: any) => {
        expect(res).toBe(expectedRes);
        done();
      });

    const testRequest = httpMock.expectOne('http://example.com');
    testRequest.flush(expectedRes);

    httpMock.verify();
  });

  // it('on error => should retry and return multiple errors', done => {
  //   const result = of(new ErrorEvent('foo')).pipe(incrementalHttpRetry(0, 5));
  //
  //   const values = { a: new ErrorEvent('foo')};
  //   const source = cold('a-|', values);
  //   expect(result).toBeObservable(source);
  // });

  it('only errors => should return the errors but delayed', () => {
    const values = { a: 'something'};
    const source = cold('-a-a-a-|', values);
    const result = source.pipe(incrementalHttpRetry(1, 5));
    expect(result).toBeObservable(source);
  });
});
