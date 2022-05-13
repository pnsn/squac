import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../header/header.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";
import { MessageService } from "@core/services/message.service";
import { AppModule } from "app/app.module";
import { ActivatedRoute } from "@angular/router";

describe("HomeComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(HomeComponent, AppModule)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(HeaderComponent)
      .mock(MessageService)
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
    const fixture = MockRender(HomeComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
