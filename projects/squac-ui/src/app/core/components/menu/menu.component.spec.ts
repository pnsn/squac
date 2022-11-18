import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../projects/squac-ui/src/app/core/services/auth.service";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";

import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder([MenuComponent], [RouterTestingModule.withRoutes([])])
      .mock(AuthService)
      .mock(MenuComponent)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {},
          },
        },
      });
  });

  it("should create", () => {
    const fixture = MockRender(MenuComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
