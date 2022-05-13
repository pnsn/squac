import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupDetailComponent } from "./channel-group-detail.component";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ChannelGroup } from "@core/models/channel-group";
import { RouterTestingModule } from "@angular/router/testing";
import { OrganizationService } from "@user/services/organization.service";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { ChannelGroupModule } from "@features/channel-group/channel-group.module";
import { MessageService } from "@core/services/message.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";

describe("ChannelGroupDetailComponent", () => {
  let component: ChannelGroupDetailComponent;
  let fixture: ComponentFixture<ChannelGroupDetailComponent>;
  let router;

  beforeEach(() => {
    return MockBuilder(ChannelGroupDetailComponent, ChannelGroupModule)
      .mock(MessageService)
      .mock(ConfirmDialogService)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(OrganizationService)
      .mock(UserService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {},
          data: of({
            channelGroup: new ChannelGroup(1, 1, "name", "description", 1, []),
          }),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to channel group", () => {
    const routerSpy = spyOn(router, "navigate");
    component.editChannelGroup();
    expect(routerSpy).toHaveBeenCalled();
  });
});
