import { LoadingService } from "@core/services/loading.service";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

import { LoadingScreenComponent } from "./loading-screen.component";

describe("LoadingScreenComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(LoadingScreenComponent).provide({
      provide: LoadingService,
      useValue: {
        loading: new BehaviorSubject(null),
        loadingStatus: new BehaviorSubject(null),
      },
    });
  });

  it("should create", () => {
    const fixture = MockRender(LoadingScreenComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
