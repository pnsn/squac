import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { OrganizationUserService } from "./organization-user.service";

describe("OrganizationUserService", () => {
  let service: OrganizationUserService = undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(OrganizationUserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});