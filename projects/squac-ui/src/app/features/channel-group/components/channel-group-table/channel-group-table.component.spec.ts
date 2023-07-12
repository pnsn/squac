import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";

import { ChannelGroupTableComponent } from "./channel-group-table.component";

describe("ChannelGroupTableComponent", () => {
  let component: ChannelGroupTableComponent;
  let fixture: ComponentFixture<ChannelGroupTableComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupTableComponent);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(ChannelGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
