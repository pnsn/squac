import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './http-error-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockSquacApiService } from './squacapi.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { throwError } from 'rxjs';
import { SquacApiService } from './squacapi.service';

describe('HttpErrorInterceptor', () => {
  let service: SquacApiService;
  let interceptor;
  let httpRequestSpy;
  let httpHandlerSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
      HttpErrorInterceptor,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true,
      },
      {
        provide: SquacApiService,
        useValue: new MockSquacApiService()
      }
    ]
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);
    service = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {

    expect(interceptor).toBeTruthy();
  });

  it('should throw error if error response returned from api', () => {
    const testError = {
      message: 'test-message',
      status: 404
    };
    // arrange
    httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError(
      testError
    ));
    // act
    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
            result => console.log('good', result),
            err => {
              console.log('error', err);
              expect(err).toEqual(`Error Code: ${testError.status}\nMessage: ${testError.message}`);
            }
        );
  });

  it('should throw error if client side error', () => {
    const testError = new ErrorEvent(
      'error',
      {
        error : new Error('test error'),
        message : 'test message',
        lineno : 402,
        filename : 'closet.html'
      }
    );
    // arrange
    httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError(
      testError
    ));
    // act
    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
            result => console.log('good', result),
            err => {
                console.log('error', err);
                expect(err).toEqual(`Error: ${testError.error.message}`);
            }
        );
  });

});
