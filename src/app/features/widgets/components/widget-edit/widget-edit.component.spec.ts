import { waitForAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetEditService } from '@features/widgets/services/widget-edit.service';
import { MessageService } from '@core/services/message.service';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { ChannelGroupsEditComponent } from './channel-groups-edit/channel-groups-edit.component';
import { ThresholdEditComponent } from './threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './metrics-edit/metrics-edit.component';
import { MockComponents, MockProvider, MockProviders, MockService } from 'ng-mocks';
import { WidgetInfoEditComponent } from './widget-info-edit/widget-info-edit.component';
import { Subject } from 'rxjs';

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
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxDatatableModule,
        AbilityModule
      ],
      providers: [
        MockProviders(
          MatDialogRef,
          AppAbility,
          PureAbility,
          MessageService
          ),
        MockProvider(WidgetEditService, {
            isValid: new Subject(),
          }),
        { provide: MAT_DIALOG_DATA, useValue: {
            channelGroups: [
             MockService(ChannelGroup)
            ],
            metrics: [
             MockService(Metric)
            ]
        } }
      ],
      declarations: [
        WidgetEditComponent, 
        MockComponents(
          ChannelGroupsEditComponent, 
          ThresholdEditComponent, 
          MetricsEditComponent,
          WidgetInfoEditComponent
          )
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
