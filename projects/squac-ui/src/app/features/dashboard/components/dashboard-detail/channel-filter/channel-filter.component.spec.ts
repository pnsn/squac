import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ViewService } from "@dashboard/services/view.service";
import { DashboardModule } from "@dashboard/dashboard.module";
import { WidgetConnectService } from "widgets";
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