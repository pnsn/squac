import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SquacApiService } from '../squacapi.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe(`AuthInterceptor`, () => {
  let service: SquacApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SquacApiService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });

    service = TestBed.get(SquacApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an Authorization header', () => {
    // service.getPosts().subscribe(response => {
    //   expect(response).toBeTruthy();
    // });
  
    // const httpRequest = httpMock.expectOne(`${service.ROOT_URL}/posts`);
  
    // expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
  });
  
});