import { TestBed } from '@angular/core/testing';

import { OrganizationsService } from './organizations.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from './squacapi.service';
import { MockSquacApiService } from './squacapi.service.mock';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService, useValue:  new MockSquacApiService()}
      ]
    });
    service = TestBed.inject(OrganizationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
