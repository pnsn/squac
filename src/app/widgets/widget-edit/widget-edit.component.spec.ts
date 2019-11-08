import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('WidgetEditComponent', () => {
  let component: WidgetEditComponent;
  let fixture: ComponentFixture<WidgetEditComponent>;
  let dialog: MatDialog;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxDatatableModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }

      ],
      declarations: [WidgetEditComponent]
    })
    .compileComponents();
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [WidgetEditComponent]
      }
    });
  }));

  beforeEach(inject([MatDialog, MAT_DIALOG_DATA],
    (d: MatDialog) => {
      dialog = d;
    })
  );



  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
