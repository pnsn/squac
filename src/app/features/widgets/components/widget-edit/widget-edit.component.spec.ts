import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThresholdEditComponent } from './threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './metrics-edit/metrics-edit.component';
import { ChannelGroupsEditComponent } from './channel-groups-edit/channel-groups-edit.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxDatatableModule,
        AbilityModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {
          data : {

          }
        } },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ],
      declarations: [
        WidgetEditComponent,
        ThresholdEditComponent,
        MetricsEditComponent,
        ChannelGroupsEditComponent,
        LoadingComponent
      ]
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
      console.log(MAT_DIALOG_DATA);
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
