import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { AuthService } from "./core/services/auth.service";
import { LoadingScreenComponent } from "@core/components/loading-screen/loading-screen.component";
import { ConfigurationService } from "@core/services/configuration.service";
import { MockBuilder, MockInstance, MockRender } from "ng-mocks";
import { MaterialModule } from "@shared/material.module";

describe("AppComponent", () => {
  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(AppComponent)
      .keep(RouterTestingModule)
      .mock(LoadingScreenComponent)
      .mock(MaterialModule)
      .mock(AuthService)
      .provide({
        provide: ConfigurationService,
        useValue: {
          getValue: () => {
            return "SQUAC";
          },
        },
      })
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
