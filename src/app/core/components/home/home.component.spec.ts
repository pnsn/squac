import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MessageService } from "@core/services/message.service";
import { AppModule } from "app/app.module";
import { MockBuilder, MockInstance, MockRender, ngMocks } from "ng-mocks";
import { HeaderComponent } from "../header/header.component";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(
      [HomeComponent, AppModule],
      [RouterTestingModule.withRoutes([])]
    )
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
