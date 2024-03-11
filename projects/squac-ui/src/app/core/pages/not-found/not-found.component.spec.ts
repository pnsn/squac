import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router, RouterModule } from "@angular/router";
import { Location } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_ROOT_PROVIDERS,
} from "ng-mocks";

import { NotFoundComponent } from "./not-found.component";

describe("NotFoundComponent", () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder([
      NotFoundComponent,
      RouterModule,
      RouterTestingModule.withRoutes([
        { path: "not-found", component: NotFoundComponent, pathMatch: "full" },
        { path: "**", redirectTo: "not-found" },
      ]),
      NG_MOCKS_ROOT_PROVIDERS,
    ]);
  });

  it("should create", () => {
    const fixture = MockRender(NotFoundComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it("should show previous route", fakeAsync(() => {
    const fixture = MockRender(NotFoundComponent);
    const component = fixture.point.componentInstance;

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    location.go("/1");

    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick();
    }

    expect(component.previousUrl).toBe("/1");
  }));
});
