import { TestBed } from "@angular/core/testing";
import { MockInstance, MockRender, ngMocks } from "ng-mocks";

import { LoadingScreenComponent } from "./loading-screen.component";

describe("LoadingScreenComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      declarations: [LoadingScreenComponent],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = MockRender(LoadingScreenComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
