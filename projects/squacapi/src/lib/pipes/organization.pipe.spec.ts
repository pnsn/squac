import { TestBed } from "@angular/core/testing";
import { OrganizationService } from "@squacapi/services/organization.service";
import { ngMocks, MockBuilder } from "ng-mocks";
import { OrganizationPipe } from "./organization.pipe";

describe("OrganizationPipe", () => {
  ngMocks.faster();
  let orgService;
  beforeAll(() => {
    return MockBuilder(OrganizationPipe).mock(OrganizationService);
  });

  beforeEach(() => {
    orgService = TestBed.inject(OrganizationService);
  });

  it("create an instance", () => {
    const pipe = new OrganizationPipe(orgService);
    expect(pipe).toBeTruthy();
  });
});
