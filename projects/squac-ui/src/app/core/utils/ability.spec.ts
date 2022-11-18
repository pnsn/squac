import { TestBed } from "@angular/core/testing";
import { AbilityModule } from "@casl/angular";
import { defineAbilitiesFor, AppAbility } from "./ability";
import { Ability, PureAbility } from "@casl/ability";
import { User } from "@squacapi/models/user";
import { Dashboard } from "@squacapi/models/dashboard";

describe("Ability", () => {
  let testAbility: Ability;

  const testUser: User = new User(
    1,
    "email",
    "firstName",
    "lastName",
    1,
    false,
    []
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbilityModule],
      providers: [
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    });
    testAbility = TestBed.inject(Ability);
  });

  it("should allow admin to manage all", () => {
    const adminUser = new User(
      1,
      "email",
      "firstName",
      "lastName",
      1,
      true,
      []
    );
    adminUser.squacAdmin = true;
    testAbility.update(defineAbilitiesFor(adminUser));
    expect(testAbility.can("manage", "all")).toEqual(true);
  });

  it("should allow with permission", () => {
    testUser.groups = ["viewer"];

    testAbility.update(defineAbilitiesFor(testUser));
    expect(testAbility.can("read", "Dashboard")).toEqual(true);
  });

  it("should not allow without permission", () => {
    testUser.groups = ["viewer"];

    testAbility.update(defineAbilitiesFor(testUser));
    expect(testAbility.can("update", "Dashboard")).toEqual(false);
  });

  it("should allow for multiple groups", () => {
    testUser.groups = ["viewer", "contributor"];

    testAbility.update(defineAbilitiesFor(testUser));

    expect(testAbility.can("update", "Measurement")).toEqual(true);
  });

  it("should allow user to update owned object", () => {
    testUser.groups = ["viewer", "contributor", "reporter"];
    const testDashboard = new Dashboard(
      1,
      testUser.id,
      "test",
      "description",
      true,
      false,
      1
    );
    testAbility.update(defineAbilitiesFor(testUser));

    expect(testAbility.can("update", testDashboard)).toEqual(true);
  });

  it("should not allow user to update not owned object", () => {
    testUser.groups = ["viewer", "contributor", "reporter"];
    const testDashboard = new Dashboard(
      1,
      3,
      "test",
      "description",
      true,
      false,
      1
    );
    testAbility.update(defineAbilitiesFor(testUser));

    expect(testAbility.can("update", testDashboard)).toEqual(false);
  });

  it("should allow user to update owned object", () => {
    testUser.groups = ["viewer", "contributor", "reporter"];
    const testDashboard = new Dashboard(
      1,
      testUser.id,
      "test",
      "description",
      true,
      false,
      1
    );
    testAbility.update(defineAbilitiesFor(testUser));

    expect(testAbility.can("update", testDashboard)).toEqual(true);
  });
});
