import { TestBed } from '@angular/core/testing';

import { OrganizationsService } from './organizations.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { UserService } from './user.service';
import { MockUserService } from './user.service.mock';
import { User } from '../models/user';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let squacApiService: SquacApiService;
  const testUser = {
    id: 1,
    email: 'email',
    firstname: 'first',
    lastname: 'last',
    organization: 1,
    is_org_admin: false,
    groups: [1],
    is_active: true,
    last_login: true
  };
  const testData = {
    id: 1,
    name: 'name',
    description: 'description',
    users: [testUser],
    groups: [1]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: SquacApiService, useValue:  new MockSquacApiService(testData)}
      ]
    });
    service = TestBed.inject(OrganizationsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get organizations from squac', () => {

    service.getOrganizations().subscribe(
      response  => {
        expect(response.length).toEqual(1);
      }
    );

  });

  it('should return recently fetched organizations', () => {
    expect(service.organizations).toEqual([]);
    service.getOrganizations().subscribe(
      response => {
        expect(service.organizations.length).toEqual(1);
      }
    );
  });

  it('should return org name', () => {
    service.getOrganizations().subscribe();

    expect(service.getOrgName(1)).toEqual(testData.name);
  });

  it('should return unknown for if no name', () => {
    service.getOrganizations().subscribe();

    expect(service.getOrgName(2)).toEqual('unknown');
  });

  it('should return org user name', () => {
    spyOn(service, 'getOrganizationUsers').and.returnValue(of( new User(
      1, 'email', 'first', 'last', 1, false, []
    )));
    service.getOrganization(1).pipe(take(1)).subscribe(
      org => {
        expect(service.getOrgUserName(1)).toEqual(testUser.firstname + ' ' + testUser.lastname);
      }
    );
  });

  it('should return org user name, unknown if no name', () => {
    expect(service.getOrgUserName(4)).toEqual('unknown');
  });

  it('should update user - post', () => {
    const postSpy = spyOn(squacApiService, 'post').and.returnValue(of(testUser));
    service.updateUser({
      email: 'string',
      isAdmin: false,
      orgId: 1,
      groups: ['viewer'],
      firstName: 'name',
      lastName: 'name'
    });

    expect(postSpy).toHaveBeenCalled();
  });

  it('should update user - patch', () => {
    const patchSpy = spyOn(squacApiService, 'patch').and.returnValue(of(testUser));
    service.updateUser({
      email: 'string',
      isAdmin: false,
      orgId: 1,
      groups: ['viewer'],
      id: 1,
      firstName: 'name',
      lastName: 'name'
    });

    expect(patchSpy).toHaveBeenCalled();

  });

  it('should  get organization with id', () => {
    service.getOrganization(1).pipe(take(1)).subscribe(
      org => {
        expect(org.id).toEqual(1);
      }
    );


  });

  it('should get org users', () => {
    const userSpy = spyOn(service, 'getOrganizationUsers').and.returnValue(of( new User(
      1, 'email', 'first', 'last', 1, false, []
    )));

    service.getOrganizationUsers(1).subscribe();

    expect(userSpy).toHaveBeenCalled();
  });

  it('should delete org user', () => {
    const deleteSpy = spyOn(squacApiService, 'delete').and.callThrough();

    service.deleteUser(1);

    expect(deleteSpy).toHaveBeenCalled();

  });
});
