import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { AuthService } from "./core/services/auth.service";
import { LoadingOverlayComponent } from "./shared/components/loading-overlay/loading-overlay.component";
import { MockBuilder, MockInstance, MockRender } from "ng-mocks";
import { MaterialModule } from "@shared/material.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";

describe("AppComponent", () => {
  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(AppComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(LoadingOverlayComponent)
      .mock(MaterialModule)
      .mock(AuthService)
      .mock(LoadingDirective)
  );

  it("should create the app", () => {
    const fixture = MockRender(AppComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });

  it('should have as title "SQUAC"', () => {
    const fixture = MockRender(AppComponent);
    const appComponent = fixture.point.componentInstance;
    expect(appComponent.title).toEqual("SQUAC");
  });

  it("should call autologin", () => {
    const loginSpy = jasmine.createSpy("loginSpy");

    MockInstance(AuthService, (instance) => {
      instance.autologin = loginSpy;
    });
    const fixture = MockRender(AppComponent);
    const appComponent = fixture.point.componentInstance;

    appComponent.ngOnInit();

    expect(loginSpy).toHaveBeenCalled();
  });
});
