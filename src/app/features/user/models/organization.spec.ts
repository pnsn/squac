import { TestBed } from "@angular/core/testing";
import { Organization, OrganizationAdapter } from "./organization";

describe("Organization", () => {
  let adapter: OrganizationAdapter;
  it("should create an instance", () => {
    expect(new Organization(1, "", "", [])).toBeTruthy();
  });

  it("should adapt from api to organization", () => {
    adapter = TestBed.inject(OrganizationAdapter);
    const testData = {
      name: "testName",
      id: 1,
      description: "",
      created_at: "",
      users: [],
    };

    const organization = adapter.adaptFromApi(testData);
    expect(organization).toBeDefined();
  });
});
