import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupViewComponent } from "./channel-group-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ChannelGroupService } from "squacapi";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";
import { AbilityModule } from "@casl/angular";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";
describe("ChannelGroupViewComponent", () => {
  let component: ChannelGroupViewComponent;
  let fixture: ComponentFixture<ChannelGroupViewComponent>;
  beforeEach(() => {
    return MockBuilder(ChannelGroupViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: new Subject(),
          data: of(),
        },
      })
      .mock(DetailPageComponent)
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
