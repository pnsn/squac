import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";

import { OrganizationUserService } from "./organization-user.service";

describe("OrganizationUserService", () => {
  beforeEach(() => {
    return MockBuilder(OrganizationUserService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(OrganizationUserService);
    expect(service).toBeDefined();
  });
});
