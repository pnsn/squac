import { TestBed } from '@angular/core/testing';

import { OrganizationsService } from './organizations.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { UserService } from './user.service';
import { MockUserService } from './user.service.mock';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService, useValue:  new MockSquacApiService()},
        {provide: UserService, useValue: new MockUserService()}
      ]
    });
    service = TestBed.inject(OrganizationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
