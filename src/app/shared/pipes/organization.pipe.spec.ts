import { TestBed } from "@angular/core/testing";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { ngMocks, MockBuilder } from "ng-mocks";
import { OrganizationPipe } from "./organization.pipe";

describe("OrganizationPipe", () => {
  ngMocks.faster();
  let orgService;
  beforeAll(() => {
    return MockBuilder(OrganizationPipe).mock(OrganizationsService);
  });

  beforeEach(() => {
    orgService = TestBed.inject(OrganizationsService);
  });

  it("create an instance", () => {
    const pipe = new OrganizationPipe(orgService);
    expect(pipe).toBeTruthy();
  });
});
