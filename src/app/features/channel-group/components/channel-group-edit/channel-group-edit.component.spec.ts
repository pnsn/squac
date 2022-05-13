import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupEditComponent } from "./channel-group-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { ActivatedRoute } from "@angular/router";
import { ChannelService } from "@channelGroup/services/channel.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NetworkService } from "@channelGroup/services/network.service";
import { of } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { MaterialModule } from "@shared/material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { ChannelGroupFilterComponent } from "./channel-group-filter/channel-group-filter.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { UserService } from "@user/services/user.service";
import { ChannelGroupMapComponent } from "@channelGroup/components/channel-group-map/channel-group-map.component";
import { MockBuilder } from "ng-mocks";
import { ChannelGroupModule } from "@features/channel-group/channel-group.module";
import { MessageService } from "@core/services/message.service";
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
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 1 }),
          snapshot: {
            data: {
              monitor: {},
            },
          },
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
