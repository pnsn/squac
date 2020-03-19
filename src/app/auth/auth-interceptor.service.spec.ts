import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from './user';
import { Data } from '@angular/router';
import { map } from 'rxjs/operators';
import { MockAuthService } from './auth.service.mock';


describe(`AuthInterceptor`, () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const testUrl = 'data/';
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide : AuthService, useValue : new MockAuthService() },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        }
      ]

    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add an Authorization header if user logged in', () => {
    service.login().subscribe();

      // Make an HTTP GET request
    httpClient.get('https://test.test.test/')
      .subscribe(response => {
        expect(response).toBeTruthy();
      }
    );
    const httpRequest = httpTestingController.expectOne('https://test.test.test/');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);

    // expect(httpRequest.request.headers.get('Authorization')).toBe(
    //   'Token token',
    // );
  });

  it('should not add an Authorization header if user not logged in', () => {
    service.logout();

      // Make an HTTP GET request
    httpClient.get('https://test.test.test/')
      .subscribe(response => {
        expect(response).toBeTruthy();
      }
    );

    const httpRequest = httpTestingController.expectOne('https://test.test.test/');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
  });

});
