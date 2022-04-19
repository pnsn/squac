import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeseriesComponent } from "./timeseries.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Widget } from "@features/widgets/models/widget";
import { MockViewService } from "@core/services/view.service.mock";
import { ViewService } from "@core/services/view.service";
import { FormsModule } from "@angular/forms";

describe("TimeseriesComponent", () => {
  let component: TimeseriesComponent;
  let fixture: ComponentFixture<TimeseriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimeseriesComponent],
      imports: [NgxChartsModule, HttpClientTestingModule, FormsModule],
      providers: [{ provide: ViewService, useClass: MockViewService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(
      1,
      2,
      "name",
      "description",
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      []
    );
    component.data = {};
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
