import { TestBed } from "@angular/core/testing";
import { MockBuilder, ngMocks } from "ng-mocks";
import { OrganizationService } from "../services";
import { UserPipe } from "./user.pipe";

describe("UserPipe", () => {
  ngMocks.faster();
  beforeAll(() => {
    return MockBuilder(UserPipe).mock(OrganizationService, {
      getOrgUserName: (value: number) => {
        return value === 1 ? "name" : "unknown";
      },
    });
  });

  it("create an instance", () => {
    const orgService = TestBed.inject(OrganizationService);
    const pipe = new UserPipe(orgService);
    expect(pipe).toBeDefined();
  });

  it("should transform id to org user name", () => {
    const orgService = TestBed.inject(OrganizationService);

    const pipe = new UserPipe(orgService);

    expect(pipe.transform(1)).toBe("name");
    expect(pipe.transform("1")).toBe("name");
    expect(pipe.transform(2)).toBe("unknown");
    expect(pipe.transform("string")).toBe("string");
  });
});
