import { TestBed } from "@angular/core/testing";
import { AuthService } from "@core/services/auth.service";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";

import { MenuComponent } from "./menu.component";

describe("MenuComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(MenuComponent);
  });

  it("should create", () => {
    const fixture = MockRender(MenuComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });

  it("should log user out", () => {
    const fixture = MockRender(MenuComponent);
    const authService = TestBed.inject(AuthService);
    fixture.point.componentInstance.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
