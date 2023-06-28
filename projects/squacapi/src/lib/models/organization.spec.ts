import { UserSimple } from "@pnsn/ngx-squacapi-client";
import { Organization } from "./organization";

describe("Organization", () => {
  it("should create an instance", () => {
    expect(new Organization()).toBeTruthy();
    expect(Organization.modelName).toBe("Organization");
  });

  it("should adapt from api to organization", () => {
    const testData = {
      name: "testName",
      id: 1,
      description: "",
      created_at: "",
      users: [],
    };

    const organization = new Organization(testData);
    expect(organization).toBeDefined();
    expect(organization.name).toBe("testName");
  });

  it("should create users", () => {
    const testUser: UserSimple = {
      firstname: "Test",
      lastname: "User",
      email: "test@email",
      organization: 1,
    };
    const testData = {
      name: "testName",
      id: 1,
      description: "",
      created_at: "",
      users: [testUser],
    };

    const organization = new Organization(testData);
    expect(organization).toBeDefined();
    expect(organization.users.length).toBe(1);
    expect(organization.users[0].fullName).toBe("Test User");
  });
});
