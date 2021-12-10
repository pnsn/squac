import { waitForAsync, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { WidgetEditComponent } from './widget-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WidgetEditService } from '@features/widgets/services/widget-edit.service';
import { MockWidgetEditService } from '@features/widgets/services/widget-edit.service.mock';
import { MessageService } from '@core/services/message.service';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { MockOrganizationsService } from '@features/user/services/organizations.service.mock';
import { Component } from '@angular/core';

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
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        { provide: MAT_DIALOG_DATA, useValue: {
            channelGroups: [
              new ChannelGroup(1, 1, "name", "Desc", 1, [1])
            ],
            metrics: [
              new Metric(1, 1, "name", "code", "Code", "ref", "unit", 1, 1, 0)
            ]
        } },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        { provide: WidgetEditService, useValue: new MockWidgetEditService()},
        {
          provide: UserService, useValue: new MockUserService()
        },
        {
          provide: OrganizationsService, useValue: new MockOrganizationsService()
        },
        MessageService
      ],
      declarations: [
        WidgetEditComponent
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
