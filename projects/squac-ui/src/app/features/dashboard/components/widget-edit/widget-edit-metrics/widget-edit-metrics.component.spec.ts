import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditMetricsComponent } from "./widget-edit-metrics.component";
import { LoadingComponent } from "../projects/squac-ui/src/app/shared/components/loading/loading.component";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MetricService } from "@squacapi/services/metric.service";
import { MaterialModule } from "../projects/squac-ui/src/app/shared/material.module";

describe("WidgetEditMetricsComponent", () => {
  let component: WidgetEditMetricsComponent;
  let fixture: ComponentFixture<WidgetEditMetricsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule, HttpClientTestingModule, MaterialModule],
      providers: [MetricService],
      declarations: [WidgetEditMetricsComponent, LoadingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditMetricsComponent);
    component = fixture.componentInstance;
    component.metrics = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
