import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimelineComponent } from "./timeline.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MeasurementPipe } from "@features/widgets/pipes/measurement.pipe";
import { Widget } from "@features/widgets/models/widget";
import { MockViewService } from "@core/services/view.service.mock";
import { ViewService } from "@core/services/view.service";

describe("TimelineComponent", () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent, MeasurementPipe],
      imports: [NgxDatatableModule, MatTooltipModule, HttpClientTestingModule],
      providers: [{ provide: ViewService, useClass: MockViewService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(
      1,
      1,
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
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
