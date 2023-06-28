import { TestBed } from "@angular/core/testing";
import { OrganizationService } from "../services/organization.service";
import { ngMocks, MockBuilder } from "ng-mocks";
import { OrganizationPipe } from "./organization.pipe";

describe("OrganizationPipe", () => {
  ngMocks.faster();
  beforeAll(() => {
    return MockBuilder(OrganizationPipe).mock(OrganizationService, {
      getOrgName: (value: number) => {
        return value === 1 ? "name" : "unknown";
      },
    });
  });

  it("create an instance", () => {
    const orgService = TestBed.inject(OrganizationService);
    const pipe = new OrganizationPipe(orgService);
    expect(pipe).toBeDefined();
  });

  it("should transform id to org name", () => {
    const orgService = TestBed.inject(OrganizationService);

    const pipe = new OrganizationPipe(orgService);

    expect(pipe.transform(1)).toBe("name");
    expect(pipe.transform("1")).toBe("name");
    expect(pipe.transform(2)).toBe("unknown");
    expect(pipe.transform("string")).toBe("string");
  });
});
