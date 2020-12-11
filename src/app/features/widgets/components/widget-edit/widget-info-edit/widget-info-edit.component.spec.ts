import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewService } from '@core/services/view.service';
import { WidgetEditService } from '@features/widgets/services/widget-edit.service';
import { MockWidgetEditService } from '@features/widgets/services/widget-edit.service.mock';

import { WidgetInfoEditComponent } from './widget-info-edit.component';

describe('WidgetInfoEditComponent', () => {
  let component: WidgetInfoEditComponent;
  let fixture: ComponentFixture<WidgetInfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetInfoEditComponent ],
      imports: [
        HttpClientTestingModule, 
        MatButtonToggleModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule
      ],
      providers: [ {provide: WidgetEditService, useValue: new MockWidgetEditService()}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
