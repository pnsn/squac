import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './http-error-interceptor.service';

describe('HttpError.InterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpError.InterceptorService = TestBed.get(HttpError.InterceptorService);
    expect(service).toBeTruthy();
  });
});
