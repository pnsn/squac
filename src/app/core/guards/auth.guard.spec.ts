import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Location } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import {
  MockBuilder,
  MockComponent,
  MockRender,
  ngMocks,
  NG_MOCKS_GUARDS,
} from "ng-mocks";
import { EMPTY } from "rxjs";
import { AuthGuard } from "./auth.guard";
import { AppModule } from "app/app.module";
import { DashboardModule } from "@dashboard/dashboard.module";
import { DashboardResolver } from "@dashboard/dashboard.resolver";
import { ChannelGroupResolver } from "@channelGroup/channel-group.resolver";
import { UserResolver } from "@user/user.resolver";
import { MetricResolver } from "@metric/metric.resolver";
import { OrganizationResolver } from "@user/organization.resolver";
import { LoginComponent } from "@features/user/components/login/login.component";
import { DashboardComponent } from "@features/dashboard/components/dashboard/dashboard.component";

describe("AuthGuard", () => {
  ngMocks.faster();

  beforeAll(() => {
    return MockBuilder(AuthGuard, AppModule)
      .exclude(NG_MOCKS_GUARDS)
      .mock(DashboardModule)
      .mock(DashboardResolver)
      .mock(ChannelGroupResolver)
      .mock(UserResolver)
      .mock(MetricResolver)
      .mock(OrganizationResolver)
      .mock(AuthService, {
        login: () => EMPTY,
        loggedIn: false,
      })
      .keep(RouterModule)
      .keep(
        RouterTestingModule.withRoutes([
          {
            path: "login",
            component: MockComponent(LoginComponent),
          },
          { path: "dashboards", component: MockComponent(DashboardComponent) },
        ])
      );
  });

  it("should not allow routing if not authorized", fakeAsync(() => {
    const fixture = MockRender(RouterOutlet);
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const authService: AuthService = TestBed.inject(AuthService);

    expect(authService.loggedIn).toBeFalse();

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

    ngMocks.stubMember(authService, "loggedIn", true);
    expect(authService.loggedIn).toBeTrue();

    location.go("/");
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // is needed for rendering of the current route.
    }

    expect(location.path()).toEqual("/dashboards");
    flush();
  }));
});
