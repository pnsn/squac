import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockSquacApiService } from '../squacapi.service.mock';
import { SquacApiService } from '../squacapi.service';
import { AuthComponent } from './auth.component';

describe('AuthService', () => {
  let router: Router;
  let httpClientSpy: { get: jasmine.Spy};
  let authService: AuthService;
  const mockSquacApiService = new MockSquacApiService(  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: AuthComponent},
          { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
        ])
      ],
      providers: [
        { provide: SquacApiService, useValue: mockSquacApiService }
      ]
    });

    router = TestBed.get(Router);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    authService = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should log user in', ()=> {

  });

  it('should log user out', ()=> {

  });
  
  it('should user out after time expires', ()=>{

  });

  it('should return correct error message', ()=>{

  });

  it('should save user data', ()=>{

  });

});
