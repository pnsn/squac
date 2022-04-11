import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ThresholdEditComponent } from "./threshold-edit.component";
import { MatListModule } from "@angular/material/list";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WidgetEditService } from "../../../services/widget-edit.service";
import { of } from "rxjs";
import { MockWidgetEditService } from "@features/widgets/services/widget-edit.service.mock";

describe("ThresholdEditComponent", () => {
  let component: ThresholdEditComponent;
  let fixture: ComponentFixture<ThresholdEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule],
      declarations: [ThresholdEditComponent],
      providers: [
        { provide: WidgetEditService, useValue: new MockWidgetEditService() },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
