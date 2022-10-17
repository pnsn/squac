import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AbilityModule } from "@casl/angular";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { AuthComponent } from "../components/auth/auth.component";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let authService: AuthService;
  beforeEach(() => {
    return MockBuilder(AuthService)
      .mock(AbilityModule)
      .mock(ApiService)
      .keep(
        RouterTestingModule.withRoutes([
          { path: "login", component: AuthComponent },
          { path: "", redirectTo: "dashboards", pathMatch: "full" },
          { path: "dashboards", component: AuthComponent },
        ])
      )
      .mock(UserService);
  });

  beforeEach(() => {
    let store = {};

    // set up fake local storage to test against
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    spyOn(localStorage, "getItem").and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, "setItem").and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, "removeItem").and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, "clear").and.callFake(mockLocalStorage.clear);

    authService = TestBed.inject(AuthService);
  });

  it("should be created", () => {
    expect(authService).toBeTruthy();
  });

  // it("should log existing user in", () => {
  //   expect(authService.loggedIn).toBeFalse();
  //   const expDate = new Date().getTime() + 10000;

  //   localStorage.setItem(
  //     "userData",
  //     JSON.stringify({
  //       email: "email",
  //       token: "token",
  //       tokenExpirationDate: expDate,
  //     })
  //   );

  //   authService.autologin();
  //   expect(authService.loggedIn).toBeTrue();
  // });

  // it("should log new user in", () => {
  //   authService.login(testUserData.email, "password").subscribe((response) => {
  //     expect(response).toEqual(testUserData);
  //   });
  // });

  // it("should not log in if no user data", () => {
  //   expect(authService.loggedIn).toBeFalse();
  //   localStorage.clear();

  //   authService.autologin();

  //   expect(localStorage.getItem("userData")).toBeNull();
  //   expect(authService.loggedIn).toBeFalse();
  // });

  // it("should log user out", () => {
  //   localStorage.setItem(
  //     "userData",
  //     JSON.stringify({ email: "", token: "", tokenExpirationDate: "string" })
  //   );

  //   authService.logout();

  //   expect(localStorage.getItem("userData")).toBeNull();
  // });

  // it("should return true if user logged in", () => {
  //   expect(authService.loggedIn).toBe(false);
  //   authService.login(testUserData.email, "password").subscribe(() => {
  //     expect(authService.loggedIn).toEqual(true);
  //   });
  // });

  // it("should return the auth token", () => {
  //   expect(authService.auth).toBeUndefined();
  //   authService.login(testUserData.email, "password").subscribe(() => {
  //     expect(authService.auth).toBeDefined();
  //   });
  // });
  // it('should log user out after time expires', fakeAsync( () => {
  //   spyOn(authService, 'logout');

  //   authService.autologout(1);

  //   tick(1);
  //   expect(authService.logout).toHaveBeenCalled();

  // }));
});
