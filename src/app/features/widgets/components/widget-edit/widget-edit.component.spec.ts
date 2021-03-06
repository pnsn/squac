import { waitForAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThresholdEditComponent } from './threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './metrics-edit/metrics-edit.component';
import { ChannelGroupsEditComponent } from './channel-groups-edit/channel-groups-edit.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetInfoEditComponent } from './widget-info-edit/widget-info-edit.component';

describe('WidgetEditComponent', () => {
  let component: WidgetEditComponent;
  let fixture: ComponentFixture<WidgetEditComponent>;
  let dialog: MatDialog;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(waitForAsync(() => {
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
        LoadingComponent,
        WidgetInfoEditComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([MatDialog, MAT_DIALOG_DATA],
    (d: MatDialog) => {
      dialog = d;

      fixture = TestBed.createComponent(WidgetEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    }
    )
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
