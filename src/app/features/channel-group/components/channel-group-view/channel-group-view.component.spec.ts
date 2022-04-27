import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupViewComponent } from "./channel-group-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { UserService } from "@user/services/user.service";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";
import { OrganizationService } from "@features/user/services/organization.service";
import { AbilityModule } from "@casl/angular";
import { BehaviorSubject } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MaterialModule } from "@shared/material.module";
import { FormsModule } from "@angular/forms";
describe("ChannelGroupViewComponent", () => {
  let component: ChannelGroupViewComponent;
  let fixture: ComponentFixture<ChannelGroupViewComponent>;
  beforeEach(() => {
    return MockBuilder(ChannelGroupViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(FormsModule)
      .mock(MaterialModule)
      .mock(NgxDatatableModule)
      .mock(TableViewComponent)
      .mock(UserPipe)
      .mock(OrganizationPipe)
      .mock(UserService, {
        user: new BehaviorSubject(null),
      })
      .mock(OrganizationService)
      .mock(AbilityModule)
      .mock(ChannelGroupService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(ChannelGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
