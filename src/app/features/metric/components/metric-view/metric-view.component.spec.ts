import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetricViewComponent } from "./metric-view.component";
import { MetricService } from "@metric/services/metric.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AbilityModule } from "@casl/angular";
import { MockBuilder } from "ng-mocks";
import { MaterialModule } from "@shared/material.module";
import { RouterTestingModule } from "@angular/router/testing";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";

describe("MetricViewComponent", () => {
  let component: MetricViewComponent;
  let fixture: ComponentFixture<MetricViewComponent>;

  beforeEach(() => {
    return MockBuilder(MetricViewComponent)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(TableViewComponent)
      .mock(NgxDatatableModule)
      .mock(MaterialModule)
      .mock(MetricService)
      .mock(AbilityModule);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MetricViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});