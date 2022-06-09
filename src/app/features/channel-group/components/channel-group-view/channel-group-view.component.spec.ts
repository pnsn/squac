import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupViewComponent } from "./channel-group-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";
import { AbilityModule } from "@casl/angular";
import { MaterialModule } from "@shared/material.module";
import { ActivatedRoute } from "@angular/router";
describe("ChannelGroupViewComponent", () => {
  let component: ChannelGroupViewComponent;
  let fixture: ComponentFixture<ChannelGroupViewComponent>;
  beforeEach(() => {
    return MockBuilder(ChannelGroupViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(ActivatedRoute)
      .mock(MaterialModule)
      .mock(TableViewComponent)
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
