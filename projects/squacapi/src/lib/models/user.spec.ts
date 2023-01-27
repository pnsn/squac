import { User } from "./user";

describe("User", () => {
  it("should create an instance", () => {
    expect(new User()).toBeTruthy();
  });

  it("should be an admin if isStaff", () => {
    const testUser = new User({
      id: 1,
      email: "",
      firstname: "",
      lastname: "",
      organization: 1,
      is_staff: true,
    });

    expect(testUser.isStaff).toBeTruthy();
  });

  it("should check group", () => {
    const testUser = new User({
      id: 1,
      firstname: "",
      lastname: "",
      organization: 1,
      is_staff: true,
      groups: new Set(["manager", "guest"]),
    });

    expect(testUser.inGroup("manager")).toBeTruthy();
    expect(testUser.inGroup("guest")).toBeTruthy();

    expect(testUser.inGroup("other")).toBeFalsy();
  });

  it("should adapt from api to user", () => {
    const testData = {
      email: "string",
      firstname: "string",
      lastname: "string",
      is_staff: false,
      groups: new Set([1]),
      id: 1,
      organization: 1,
      is_org_admin: false,
      last_login: "string",
      is_active: true,
    };

    const user = new User(testData);
    expect(user).toBeDefined();
  });
});
