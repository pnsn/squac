import { TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { HeaderComponent } from "../header/header.component";
import { RouterTestingModule } from "@angular/router/testing";
import {
  MockComponent,
  MockInstance,
  MockModule,
  MockProvider,
  MockRender,
  ngMocks,
} from "ng-mocks";
import { MaterialModule } from "@shared/material.module";
import { MessageService } from "@core/services/message.service";
import { AppModule } from "app/app.module";
import { ActivatedRoute } from "@angular/router";

describe("HomeComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MockModule(MaterialModule),
        MockModule(AppModule),
      ],
      declarations: [HomeComponent, MockComponent(HeaderComponent)],
      providers: [
        MockProvider(MessageService),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = MockRender(HomeComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
