import { AuthComponent } from "./auth.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";

describe("AuthComponent", () => {
  ngMocks.faster();
  MockInstance.scope();
  beforeEach(() => MockBuilder(AuthComponent).keep(RouterTestingModule));

  it("should create", () => {
    const fixture = MockRender(AuthComponent);

    expect(fixture.point.componentInstance).toEqual(jasmine.any(AuthComponent));
  });
});
