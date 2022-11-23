import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChannelGroupModule } from "@channelGroup/channel-group.module";
import { MaterialModule } from "@shared/material.module";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { MockBuilder } from "ng-mocks";

import { ChannelGroupTableComponent } from "./channel-group-table.component";

describe("ChannelGroupTableComponent", () => {
  let component: ChannelGroupTableComponent;
  let fixture: ComponentFixture<ChannelGroupTableComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupTableComponent, ChannelGroupModule)
      .mock(NgxDatatableModule)
      .mock(MaterialModule);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(ChannelGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
