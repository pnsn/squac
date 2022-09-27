import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupEditComponent } from "./channel-group-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { ActivatedRoute } from "@angular/router";
import { ChannelService } from "@channelGroup/services/channel.service";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChannelGroupFilterComponent } from "./channel-group-filter/channel-group-filter.component";
import { UserService } from "@user/services/user.service";
import { ChannelGroupMapComponent } from "@channelGroup/components/channel-group-map/channel-group-map.component";
import { MockBuilder } from "ng-mocks";
import { ChannelGroupModule } from "@features/channel-group/channel-group.module";
import { MessageService } from "@core/services/message.service";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe("ChannelGroupEditComponent", () => {
  let component: ChannelGroupEditComponent;
  let fixture: ComponentFixture<ChannelGroupEditComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupEditComponent, ChannelGroupModule)
      .mock(ReactiveFormsModule)
      .mock(NgxDatatableModule)
      .mock(ChannelGroupFilterComponent)
      .mock(ChannelGroupMapComponent)
      .mock(UserService)
      .mock(MessageService)
      .mock(ChannelService)
      .mock(ChannelGroupService)
      .mock(LoadingDirective)
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
