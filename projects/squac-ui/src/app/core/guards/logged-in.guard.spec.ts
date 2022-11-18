import { RouterTestingModule } from "@angular/router/testing";
import { LoginComponent } from "../projects/squac-ui/src/app/features/user/components/login/login.component";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_GUARDS,
} from "ng-mocks";
import { AuthService } from "../services/auth.service";
import { LoggedInGuard } from "./logged-in.guard";

describe("LoggedInGuard", () => {
  let guard: LoggedInGuard;
  beforeEach(() => {
    return MockBuilder(LoggedInGuard)
      .exclude(NG_MOCKS_GUARDS)
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
      isAuthenticated: () => true,
    }));
    guard = MockRender(LoggedInGuard).point.componentInstance;
    expect(guard.canActivate()).toEqual(false);
  });

  it("should allow user to access log in after logging out", () => {
    MockInstance(AuthService, () => ({
      isAuthenticated: () => false,
    }));
    guard = MockRender(LoggedInGuard).point.componentInstance;
    expect(guard.canActivate()).toEqual(true);
  });
});
