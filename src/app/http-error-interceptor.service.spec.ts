import { TestBed } from '@angular/core/testing';

import { HttpErrorInterceptor } from './http-error-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockSquacApiService } from './squacapi.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HttpErrorInterceptor', () => {
  let service: MockSquacApiService;
  let interceptor;
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
        provide: MockSquacApiService,
        useValue: new MockSquacApiService()
      }
    ]
    });
    interceptor = TestBed.get(HttpErrorInterceptor);
    service = TestBed.get(MockSquacApiService);
  });

  it('should be created', () => {

    expect(interceptor).toBeTruthy();
  });


});
