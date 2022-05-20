import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditMetricsComponent } from "./widget-edit-metrics.component";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MetricService } from "@metric/services/metric.service";
import { WidgetEditService } from "@features/widget/services/widget-config.service";

describe("WidgetEditMetricsComponent", () => {
  let component: WidgetEditMetricsComponent;
  let fixture: ComponentFixture<WidgetEditMetricsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule, HttpClientTestingModule],
      providers: [
        MetricService,
        {
          provide: WidgetEditService,
          useValue: {
            getMetricIds: () => [],
          },
        },
      ],
      declarations: [WidgetEditMetricsComponent, LoadingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditMetricsComponent);
    component = fixture.componentInstance;
    component.metrics = [];
    component.availableMetrics = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
