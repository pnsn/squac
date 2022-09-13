import { LoadingService } from "@core/services/loading.service";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

import { LoadingOverlayComponent } from "./loading-overlay.component";

describe("LoadingOverlayComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(LoadingOverlayComponent).provide({
      provide: LoadingService,
      useValue: {
        loading: new BehaviorSubject(null),
        loadingStatus: new BehaviorSubject(null),
      },
    });
  });

  it("should create", () => {
    const fixture = MockRender(LoadingOverlayComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
