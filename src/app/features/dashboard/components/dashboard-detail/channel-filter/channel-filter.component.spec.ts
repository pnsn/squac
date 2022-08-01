import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewService } from "@core/services/view.service";
import { DashboardModule } from "@features/dashboard/dashboard.module";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { MockBuilder } from "ng-mocks";

import { ChannelFilterComponent } from "./channel-filter.component";

describe("ChannelFilterComponent", () => {
  let component: ChannelFilterComponent;
  let fixture: ComponentFixture<ChannelFilterComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelFilterComponent, DashboardModule)
      .mock(FormsModule)
      .mock(ReactiveFormsModule)
      .mock(ViewService)
      .mock(WidgetConnectService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFilterComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({ checkboxes: new FormGroup({}) });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
