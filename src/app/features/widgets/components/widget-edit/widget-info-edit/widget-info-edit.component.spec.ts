import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WidgetEditService } from "@features/widgets/services/widget-edit.service";
import { MockWidgetEditService } from "@features/widgets/services/widget-edit.service.mock";
import { MaterialModule } from "@shared/material.module";

import { WidgetInfoEditComponent } from "./widget-info-edit.component";

describe("WidgetInfoEditComponent", () => {
  let component: WidgetInfoEditComponent;
  let fixture: ComponentFixture<WidgetInfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetInfoEditComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: WidgetEditService, useValue: new MockWidgetEditService() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
