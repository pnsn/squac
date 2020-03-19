import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '../squacapi.service.mock';
import { SquacApiService } from '../squacapi.service';

describe('UserService', () => {
  let httpClientSpy: { get: jasmine.Spy};
  let userService: UserService;
  const mockSquacApiService = new MockSquacApiService(  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: SquacApiService, useValue: mockSquacApiService }
      ]
    });
    this.httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    this.userService = TestBed.inject(UserService);
    // authService = new AuthService(httpClientSpy as any, router);
  });
});
