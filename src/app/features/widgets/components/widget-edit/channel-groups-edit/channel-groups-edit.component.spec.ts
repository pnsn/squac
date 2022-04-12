import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupsEditComponent } from "./channel-groups-edit.component";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { WidgetEditService } from "@features/widgets/services/widget-edit.service";
import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { UserService } from "@features/user/services/user.service";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ReactiveFormsModule } from "@angular/forms";
import { MockBuilder } from "ng-mocks";
import { MaterialModule } from "@shared/material.module";
import { EMPTY } from "rxjs";

describe("ChannelGroupsEditComponent", () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupsEditComponent)
      .mock(LoadingComponent)
      .mock(ReactiveFormsModule)
      .mock(MatSlideToggleModule)
      .mock(MaterialModule)
      .mock(NgxDatatableModule)
      .provide({
        provide: WidgetEditService,
        useValue: {
          getChannelGroup: () => {
            return;
          },
        },
      })
      .provide({
        provide: OrganizationsService,
        useValue: {
          getOrganization: () => {
            return EMPTY;
          },
        },
      })
      .mock(ChannelGroupsService)
      .mock(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsEditComponent);
    component = fixture.componentInstance;
    component.channelGroups = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
