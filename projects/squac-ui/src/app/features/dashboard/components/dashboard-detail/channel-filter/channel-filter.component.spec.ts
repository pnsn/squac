import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ViewService } from "../projects/squac-ui/src/app/features/dashboard/services/view.service";
import { DashboardModule } from "../projects/squac-ui/src/app/features/dashboard/dashboard.module";
import { WidgetConnectService } from "../projects/widgets/src/widgets/services/widget-connect.service";
import { MockBuilder } from "ng-mocks";
import { Subject } from "rxjs";

import { ChannelFilterComponent } from "./channel-filter.component";

describe("ChannelFilterComponent", () => {
  let component: ChannelFilterComponent;
  let fixture: ComponentFixture<ChannelFilterComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelFilterComponent, DashboardModule)
      .mock(FormsModule)
      .mock(ReactiveFormsModule)
      .provide({
        provide: ViewService,
        useValue: {
          channelGroupId: new Subject(),
        },
      })
      .mock(WidgetConnectService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFilterComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      checkboxes: new UntypedFormGroup({}),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
