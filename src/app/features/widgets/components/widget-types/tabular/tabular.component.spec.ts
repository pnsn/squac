import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { TabularComponent } from "./tabular.component";
import { MeasurementPipe } from "@features/widgets/pipes/measurement.pipe";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Widget } from "@features/widgets/models/widget";
import { MockViewService } from "@core/services/view.service.mock";
import { ViewService } from "@core/services/view.service";

describe("TabularComponent", () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabularComponent, MeasurementPipe],
      imports: [NgxDatatableModule, HttpClientTestingModule],
      providers: [{ provide: ViewService, useClass: MockViewService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.columns = [];
    component.rows = [];
    component.data = {};
    component.channels = [];
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
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
