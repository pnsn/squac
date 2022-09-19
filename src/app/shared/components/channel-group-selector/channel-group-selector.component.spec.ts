import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { SharedModule } from "@shared/shared.module";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { ChannelGroupSelectorComponent } from "./channel-group-selector.component";

describe("ChannelGroupSelectorComponent", () => {
  let component: ChannelGroupSelectorComponent;
  let fixture: ComponentFixture<ChannelGroupSelectorComponent>;

  beforeEach(() => {
    return MockBuilder(ChannelGroupSelectorComponent, SharedModule)
      .provide({
        provide: ChannelGroupService,
        useValue: {
          getChannelGroups: () => {
            return of();
          },
        },
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {},
      })
      .provide({
        provide: Router,
        useValue: {},
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
