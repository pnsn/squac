import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupEditComponent } from "./channel-group-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "squacapi";
import { ActivatedRoute } from "@angular/router";
import { ChannelService } from "squacapi";
import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { MessageService } from "@core/services/message.service";
import { MatchingRuleService } from "squacapi";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { SharingToggleComponent } from "@shared/components/sharing-toggle/sharing-toggle.component";
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe("ChannelGroupEditComponent", () => {
  let component: ChannelGroupEditComponent;
  let fixture: ComponentFixture<ChannelGroupEditComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupEditComponent)
      .mock([
        UserService,
        MessageService,
        ConfirmDialogService,
        ChannelGroupService,
        MessageService,
        MatchingRuleService,
        DateService,
        LoadingService,
        ChannelService,
      ])
      .mock(FormBuilder)
      .mock(SharingToggleComponent)
      .mock(RouterTestingModule.withRoutes([]))
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 1 }),
          snapshot: {
            data: {
              monitor: {},
            },
          },
          data: of({}),
        },
      });
  });
  it("should create", () => {
    fixture = TestBed.createComponent(ChannelGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
