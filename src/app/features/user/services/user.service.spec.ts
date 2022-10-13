import { TestBed } from "@angular/core/testing";
import { Ability } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { UserService } from "./user.service";

describe("UserService", () => {
  let userService: UserService;
  const testData = {
    id: 1,
    email: "email",
    firstname: "first",
    lastname: "last",
    organization: 1,
    is_org_admin: false,
    groups: [1, 2],
    is_staff: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbilityModule],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: Ability, useValue: new Ability() },
      ],
    });
    userService = TestBed.inject(UserService);
  });

  it("should create the app", () => {
    expect(userService).toBeTruthy();
  });

  // it("should get user", () => {
  //   const getSpy = spyOn(squacApiService, "get").and.callThrough();
  //   userService.getUser().subscribe((response) => {
  //     expect(response.id).toEqual(1);
  //   });

  //   expect(getSpy).toHaveBeenCalled();
  // });
  // it("should return current user once set", () => {
  //   userService.getUser().subscribe((response) => {
  //     expect(response.id).toEqual(1);
  //   });
  //   const getSpy = spyOn(squacApiService, "get").and.returnValue(of({}));

  //   userService.getUser().subscribe((response) => {
  //     expect(response.id).toEqual(1);
  //   });

  //   expect(getSpy).not.toHaveBeenCalled();
  // });

  // it("should return user org", () => {
  //   userService.fetchUser();
  //   expect(userService.userOrg).toEqual(1);
  // });

  // it("should log user out", () => {
  //   userService.fetchUser();
  //   userService.logout();
  //   userService.user.subscribe((user) => {
  //     expect(user).toBeNull();
  //   });
  // });

  // it("should update user info", () => {
  //   const patchSpy = spyOn(squacApiService, "patch").and.callThrough();

  //   userService
  //     .updateUser({ firstname: "name", lastname: "lastname" })
  //     .subscribe();

  //   expect(patchSpy).toHaveBeenCalled();
  // });

  // it("should fetch user", () => {
  //   userService.user.pipe(take(1)).subscribe((user) => {
  //     expect(user).toBeNull();
  //   });

  //   userService.fetchUser();

  //   userService.user.pipe(take(1)).subscribe((user) => {
  //     expect(user).toBeDefined();
  //   });
  // });
});
