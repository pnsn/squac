import { Organization } from "./organization";

describe("Organization", () => {
  it("should create an instance", () => {
    expect(new Organization()).toBeTruthy();
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
  });
});
