import { TestBed } from "@angular/core/testing";

import { OrganizationService } from "./organization.service";
import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { User } from "@user/models/user";
import { of } from "rxjs";
import { take } from "rxjs/operators";

describe("OrganizationService", () => {
  let service: OrganizationService;
  let squacApiService: SquacApiService;
  const testUser = {
    id: 1,
    email: "email",
    firstname: "first",
    lastname: "last",
    organization: 1,
    is_staff: false,
    groups: [1],
    is_active: true,
    is_org_admin: false,
    last_login: true,
  };
  const testData = {
    id: 1,
    name: "name",
    description: "description",
    users: [testUser],
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: SquacApiService,
          useValue: new MockSquacApiService(testData),
        },
      ],
    });
    service = TestBed.inject(OrganizationService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get organizations from squac", () => {
    service.getOrganizations().subscribe((response) => {
      expect(response.length).toEqual(1);
    });
  });

  it("should return recently fetched organizations", () => {
    expect(service.organizations).toEqual([]);
    service.getOrganizations().subscribe(() => {
      expect(service.organizations.length).toEqual(1);
    });
  });

  it("should return org name", () => {
    service.getOrganizations().subscribe();

    expect(service.getOrgName(1)).toEqual(testData.name);
  });

  it("should return unknown for if no name", () => {
    service.getOrganizations().subscribe();

    expect(service.getOrgName(2)).toEqual("unknown");
  });

  it("should return org user name", () => {
    service
      .getOrganizations()
      .pipe(take(1))
      .subscribe(() => {
        expect(service.getOrgUserName(1)).toEqual(
          testUser.firstname + " " + testUser.lastname
        );
      });
  });

  it("should return org user name, unknown if no name", () => {
    expect(service.getOrgUserName(4)).toEqual("unknown");
  });

  it("should add user - post", () => {
    const postSpy = spyOn(squacApiService, "post").and.returnValue(
      of(testUser)
    );
    service.updateUser(new User(null, "email", "first", "last", 1, false, []));

    expect(postSpy).toHaveBeenCalled();
  });

  it("should update user - patch", () => {
    const patchSpy = spyOn(squacApiService, "patch").and.returnValue(
      of(testUser)
    );
    service.updateUser(new User(1, "email", "first", "last", 1, false, []));

    expect(patchSpy).toHaveBeenCalled();
  });

  it("should  get organization with id", () => {
    service
      .getOrganization(1)
      .pipe(take(1))
      .subscribe((org) => {
        expect(org.id).toEqual(1);
      });
  });

  it("should get org users", () => {
    const userSpy = spyOn(service, "getOrganizationUsers").and.returnValue(
      of([new User(1, "email", "first", "last", 1, false, [])])
    );

    service.getOrganizationUsers(1).subscribe();

    expect(userSpy).toHaveBeenCalled();
  });

  it("should delete org user", () => {
    const deleteSpy = spyOn(squacApiService, "delete").and.callThrough();

    service.deleteUser(1);

    expect(deleteSpy).toHaveBeenCalled();
  });
});