import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditComponent } from "./widget-edit.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AbilityModule } from "@casl/angular";
import { PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { WidgetEditService } from "@features/widget/services/widget-edit.service";
import { MessageService } from "@core/services/message.service";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { WidgetEditChannelGroupComponent } from "./widget-edit-channel-group/widget-edit-channel-group.component";
import { WidgetEditThresholdsComponent } from "./widget-edit-thresholds/widget-edit-thresholds.component";
import { WidgetEditMetricsComponent } from "./widget-edit-metrics/widget-edit-metrics.component";
import {
  MockComponents,
  MockProvider,
  MockProviders,
  MockService,
} from "ng-mocks";
import { WidgetEditInfoComponent } from "./widget-edit-info/widget-edit-info.component";
import { Subject } from "rxjs";

describe("WidgetEditComponent", () => {
  let component: WidgetEditComponent;
  let fixture: ComponentFixture<WidgetEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxDatatableModule,
        AbilityModule,
      ],
      providers: [
        MockProviders(MatDialogRef, AppAbility, PureAbility, MessageService),
        MockProvider(WidgetEditService, {
          isValid: new Subject(),
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            channelGroups: [MockService(ChannelGroup)],
            metrics: [MockService(Metric)],
          },
        },
      ],
      declarations: [
        WidgetEditComponent,
        MockComponents(
          WidgetEditChannelGroupComponent,
          WidgetEditThresholdsComponent,
          WidgetEditMetricsComponent,
          WidgetEditInfoComponent
        ),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    // dialog = d;

    fixture = TestBed.createComponent(WidgetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});