import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";

import { NotFoundComponent } from "./not-found.component";

describe("NotFoundComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(NotFoundComponent).keep(
      RouterTestingModule.withRoutes([])
    );
  });

  it("should create", () => {
    const fixture = MockRender(NotFoundComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
