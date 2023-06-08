import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditComponent } from "./widget-edit.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AbilityModule } from "@casl/angular";
import { PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MessageService } from "@core/services/message.service";
import { ChannelGroup } from "squacapi";
import { Metric } from "squacapi";
import { WidgetEditOptionsComponent } from "./widget-edit-options/widget-edit-options.component";
import { WidgetEditMetricsComponent } from "./widget-edit-metrics/widget-edit-metrics.component";
import {
  MockComponents,
  MockDirective,
  MockProviders,
  MockService,
} from "ng-mocks";
import { WidgetEditInfoComponent } from "./widget-edit-info/widget-edit-info.component";
import { WidgetTypeExampleDirective } from "./widget-edit-info/widget-type-example/widget-type-example.directive";

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
        AbilityModule,
      ],
      providers: [
        MockProviders(MatDialogRef, AppAbility, PureAbility, MessageService),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            channelGroups: [MockService(ChannelGroup)],
            metrics: [MockService(Metric)],
          },
        },
      ],
      declarations: [
        MockDirective(WidgetTypeExampleDirective),
        WidgetEditComponent,
        MockComponents(
          WidgetEditOptionsComponent,
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
