import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetricViewComponent } from "./metric-view.component";
import { MetricService } from "squacapi";
import { AbilityModule } from "@casl/angular";
import { MockBuilder } from "ng-mocks";
import { RouterTestingModule } from "@angular/router/testing";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";

describe("MetricViewComponent", () => {
  let component: MetricViewComponent;
  let fixture: ComponentFixture<MetricViewComponent>;

  beforeEach(() => {
    return MockBuilder(MetricViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: new Subject(),
          data: of(),
        },
      })
      .mock(TableViewComponent)
      .mock(MetricService)
      .mock(DetailPageComponent)
      .mock(AbilityModule);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MetricViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
