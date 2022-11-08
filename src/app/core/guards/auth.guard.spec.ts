import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Location } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router, RouterOutlet } from "@angular/router";
import {
  MockBuilder,
  MockComponent,
  MockRender,
  ngMocks,
  NG_MOCKS_GUARDS,
} from "ng-mocks";
import { EMPTY } from "rxjs";
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "@features/user/components/login/login.component";
import { DashboardComponent } from "@features/dashboard/components/dashboard-main/dashboard.component";

describe("AuthGuard", () => {
  ngMocks.faster();

  beforeAll(() => {
    return MockBuilder(AuthGuard)
      .exclude(NG_MOCKS_GUARDS)
      .mock(AuthService, {
        login: () => EMPTY,
        isAuthenticated: () => false,
      })
      .keep(
        RouterTestingModule.withRoutes([
          {
            path: "login",
            component: MockComponent(LoginComponent),
          },
          {
            path: "",
            pathMatch: "prefix",
            canActivate: [AuthGuard],
            children: [
              {
                path: "",
                pathMatch: "full",
                redirectTo: "dashboards",
              },
              {
                path: "dashboards",
                component: MockComponent(DashboardComponent),
              },
            ],
          },
        ])
      );
  });

  it("should not allow routing if not authorized", fakeAsync(() => {
    const fixture = MockRender(RouterOutlet);
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const authService: AuthService = TestBed.inject(AuthService);

    expect(authService.isAuthenticated()).toBeFalse();
    location.go("/");
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // is needed for rendering of the current route.
    }

    expect(location.path()).toEqual("/login");
    flush();
  }));

  it("should allow routing after authorization", fakeAsync(() => {
    const fixture = MockRender(RouterOutlet);
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const authService: AuthService = TestBed.inject(AuthService);

    ngMocks.stubMember(authService, "isAuthenticated", () => true);
    expect(authService.isAuthenticated()).toBeTrue();

    location.go("/");
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // is needed for rendering of the current route.
    }

    expect(location.path()).toEqual("/dashboards");
    flush();
  }));
});
