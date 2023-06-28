import { HttpEventType, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { Organization } from "../models";

import { OrganizationService } from "./organization.service";

describe("OrganizationService", () => {
  beforeEach(() => {
    return MockBuilder(OrganizationService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(OrganizationService);
    expect(service).toBeTruthy();
  });

  it("should return org user name", () => {
    const service = TestBed.inject(OrganizationService);
    expect(service.getOrgUserName(1)).toBe("unknown");

    service["orgUsers"] = { 1: { first: "firstname", last: "lastname" } };
    expect(service.getOrgUserName(1)).toBe("firstname lastname");
  });

  it("should return org name", () => {
    const service = TestBed.inject(OrganizationService);
    expect(service.getOrgName(1)).toBe("unknown");

    service["localOrganizations"] = [
      new Organization({ name: "organization name", id: 1 }),
    ];
    expect(service.getOrgName(1)).toBe("organization name");
  });
});
