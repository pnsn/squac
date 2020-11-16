import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { MockOrganizationsService } from '@features/user/services/organizations.service.mock';
import { MockUserService } from '@features/user/services/user.service.mock';
import { OrganizationPipe } from './organization.pipe';

describe('OrganizationPipe', () => {
  let orgService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: OrganizationsService, useValue: new MockOrganizationsService() }
      ]
    });
    orgService = TestBed.inject(OrganizationsService);
  });

  it('create an instance', () => {
    const pipe = new OrganizationPipe(orgService);
    expect(pipe).toBeTruthy();
  });
});
