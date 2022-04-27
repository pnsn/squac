import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Location } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { MockBuilder, MockRender, ngMocks, NG_MOCKS_GUARDS } from "ng-mocks";
import { EMPTY } from "rxjs";
import { AuthGuard } from "./auth.guard";
import { AppModule } from "app/app.module";
import { DashboardsModule } from "@features/dashboards/dashboards.module";
import { DashboardsResolver } from "@features/dashboards/dashboards.resolver";
import { ChannelGroupsResolver } from "@features/channel-groups/channel-groups.resolver";
import { UserResolver } from "@features/user/user.resolver";
import { MetricsResolver } from "@features/metrics/metrics.resolver";
import { StatTypeResolver } from "@features/widget/stat-type.resolver";
import { OrganizationResolver } from "@features/user/organization.resolver";

describe("AuthGuard", () => {
  ngMocks.faster();

  beforeAll(() => {
    return MockBuilder(AuthGuard, AppModule)
      .exclude(NG_MOCKS_GUARDS)
      .mock(DashboardsModule)
      .mock(DashboardsResolver)
      .mock(ChannelGroupsResolver)
      .mock(UserResolver)
      .mock(MetricsResolver)
      .mock(StatTypeResolver)
      .mock(OrganizationResolver)
      .mock(AuthService, {
        login: () => EMPTY,
        loggedIn: false,
      })
      .keep(RouterModule)
      .keep(RouterTestingModule.withRoutes([]));
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
