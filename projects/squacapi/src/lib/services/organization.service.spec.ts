import { HttpClientModule } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  ApiModule,
  ApiService,
  BASE_PATH,
  ReadOnlyOrganizationSerializer,
} from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { Organization } from "../models";

import { OrganizationService } from "./organization.service";

describe("OrganizationService", () => {
  let service: OrganizationService;
  beforeEach(() => {
    return MockBuilder(
      [OrganizationService, ApiService, HttpClientModule],
      [ApiModule, BASE_PATH]
    )
      .replace(HttpClientModule, HttpClientTestingModule)
      .mock(BASE_PATH, "");
  });

  beforeEach(() => {
    service = TestBed.inject(OrganizationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return org user name", () => {
    expect(service.getOrgUserName(1)).toBe("unknown");

    service["orgUsers"] = { 1: { first: "firstname", last: "lastname" } };
    expect(service.getOrgUserName(1)).toBe("firstname lastname");
  });

  it("should return org name", () => {
    expect(service.getOrgName(1)).toBe("unknown");

    service["localOrganizations"] = [
      new Organization({ name: "organization name", id: 1 }),
    ];
    expect(service.getOrgName(1)).toBe("organization name");
  });

  it("should store organizations", () => {
    const testData: ReadOnlyOrganizationSerializer[] = [
      {
        id: 1,
        name: "Test Organization",
        users: [
          {
            id: 1,
            firstname: "first name",
            lastname: "lastname",
            email: "email@email",
            organization: 1,
          },
        ],
      },
    ];
    const httpMock = TestBed.inject(HttpTestingController);
    service.list().subscribe();

    const req = httpMock.expectOne("/api/organization/organizations/");
    expect(req.request.method).toBe("GET");
    req.flush(testData);
    httpMock.verify();

    expect(service.getOrgName(1)).toBe("Test Organization");
  });
});
