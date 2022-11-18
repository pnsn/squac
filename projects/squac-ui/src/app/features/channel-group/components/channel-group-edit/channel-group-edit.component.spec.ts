import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupEditComponent } from "./channel-group-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "@squacapi/services/channel-group.service";
import { ActivatedRoute } from "@angular/router";
import { ChannelService } from "@squacapi/services/channel.service";
import { UntypedFormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { UserService } from "../projects/squac-ui/src/app/features/user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { ChannelGroupModule } from "../projects/squac-ui/src/app/features/channel-group/channel-group.module";
import { MessageService } from "../projects/squac-ui/src/app/core/services/message.service";
import { MatchingRuleService } from "@squacapi/services/matching-rule.service";
import { DateService } from "../projects/squac-ui/src/app/core/services/date.service";
import { LoadingService } from "../projects/squac-ui/src/app/core/services/loading.service";
import { ConfirmDialogService } from "../projects/squac-ui/src/app/core/services/confirm-dialog.service";
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe("ChannelGroupEditComponent", () => {
  let component: ChannelGroupEditComponent;
  let fixture: ComponentFixture<ChannelGroupEditComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupEditComponent)
      .mock(ChannelGroupModule)
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
      .mock(UntypedFormBuilder)
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
