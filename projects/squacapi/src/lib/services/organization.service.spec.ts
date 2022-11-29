import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { OrganizationService } from "./organization.service";

describe("OrganizationService", () => {
  let service: OrganizationService = undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(OrganizationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
