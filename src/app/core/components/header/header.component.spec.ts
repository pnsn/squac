import { HeaderComponent } from "./header.component";
import { AuthService } from "@core/services/auth.service";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";
import { AppModule } from "app/app.module";
import { AbilityModule } from "@casl/angular";

describe("HeaderComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(HeaderComponent, AppModule)
      .mock(AuthService)
      .mock(AbilityModule);
  });

  it("should create", () => {
    const fixture = MockRender(HeaderComponent);
    expect(fixture.point.componentInstance).toEqual(
      jasmine.any(HeaderComponent)
    );
  });

  it("should logout", () => {
    const spyLogout = MockInstance(
      AuthService,
      "logout",
      jasmine.createSpy("logoutSpy")
    );

    const fixture = MockRender(HeaderComponent);

    const component = fixture.point.componentInstance;

    component.logout();

    expect(spyLogout).toHaveBeenCalled();
  });
});
