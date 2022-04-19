import { LoggedInGuard } from "./logged-in.guard";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../services/auth.service";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_GUARDS,
} from "ng-mocks";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "@features/user/components/login/login.component";
import { AppModule } from "app/app.module";

describe("LoggedInGuard", () => {
  let guard: LoggedInGuard;
  beforeEach(() => {
    return MockBuilder(LoggedInGuard, AppModule)
      .exclude(NG_MOCKS_GUARDS)
      .keep(RouterModule)
      .mock(LoginComponent)
      .mock(
        RouterTestingModule.withRoutes([
          {
            path: "login",
            component: LoginComponent,
            canActivate: [LoggedInGuard],
          },
          { path: "", component: LoginComponent },
        ])
      )
      .mock(AuthService);
  });

  it("should be created", () => {
    guard = MockRender(LoggedInGuard).point.componentInstance;
    expect(guard).toBeTruthy();
  });

  it("should not allow user to access log in page after logged in", () => {
    MockInstance(AuthService, () => ({
      loggedIn: true,
    }));
    guard = MockRender(LoggedInGuard).point.componentInstance;
    expect(guard.canActivate()).toEqual(false);
  });

  it("should allow user to access log in after logging out", () => {
    MockInstance(AuthService, () => ({
      loggedIn: false,
    }));
    guard = MockRender(LoggedInGuard).point.componentInstance;
    expect(guard.canActivate()).toEqual(true);
  });
});
