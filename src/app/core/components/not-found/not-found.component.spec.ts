import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockInstance, MockRender, ngMocks } from "ng-mocks";

import { NotFoundComponent } from "./not-found.component";

describe("NotFoundComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [RouterTestingModule.withRoutes([])],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = MockRender(NotFoundComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
