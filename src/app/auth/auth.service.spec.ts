import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { appRoutes } from '../app-routing.module';

describe('AuthService', () => {
  let router: Router;
  let httpClientSpy: { get: jasmine.Spy};
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(appRoutes)
      ]
    });

    router = TestBed.get(Router);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    authService = new AuthService(httpClientSpy as any, router);
  });

  // it('should be created', () => {
  //   // expect(authService).toBeTruthy();
  // });

});
