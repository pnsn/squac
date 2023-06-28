import { User } from "./user";

describe("User", () => {
  it("should create an instance", () => {
    expect(new User()).toBeTruthy();
    expect(User.modelName).toBe("User");
  });

  it("should be an admin if isStaff", () => {
    const testUser = new User({
      id: 1,
      email: "",
      firstname: "",
      lastname: "",
      organization: 1,
      is_staff: true,
      groups: [],
    });

    expect(testUser.isAdmin).toBeFalsy();
    expect(testUser.isStaff).toBeTruthy();
  });

  it("should check group", () => {
    const testUser = new User({
      id: 1,
      firstname: "",
      lastname: "",
      organization: 1,
      is_staff: true,
      groups: ["manager", "guest"],
    });

    expect(testUser.inGroup("manager")).toBeTruthy();
    expect(testUser.inGroup("guest")).toBeTruthy();

    expect(testUser.inGroup("other")).toBeFalsy();
  });

  it("should serialize and deserialize", () => {
    const testData = {
      email: "string",
      firstname: "string",
      lastname: "string",
      is_staff: false,
      groups: ["reporter"],
      id: 1,
      organization: 1,
      is_org_admin: false,
      last_login: "string",
      is_active: true,
    };

    const user = new User(testData);
    expect(user).toBeDefined();

    const json = user.toJson();

    expect(json).toEqual({
      email: testData.email,
      firstname: testData.firstname,
      lastname: testData.lastname,
      organization: testData.organization,
      is_org_admin: testData.is_org_admin,
      is_active: testData.is_active,
      groups: testData.groups,
    });
  });
});
