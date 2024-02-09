import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConnectService } from "widgets";
import { MockBuilder } from "ng-mocks";
import { Subject } from "rxjs";

import { ChannelFilterComponent } from "./channel-filter.component";

describe("ChannelFilterComponent", () => {
  let component: ChannelFilterComponent;
  let fixture: ComponentFixture<ChannelFilterComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelFilterComponent)
      .mock(FormsModule)
      .mock(ReactiveFormsModule)
      .mock(FormBuilder)
      .provide({
        provide: ViewService,
        useValue: {
          channelGroupId: new Subject(),
          channelsChanged: new Subject(),
        },
      })
      .mock(WidgetConnectService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFilterComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      checkboxes: new FormGroup({}),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
