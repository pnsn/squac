import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupViewComponent } from "./channel-group-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { ActivatedRoute } from "@angular/router";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { Ability, PureAbility } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { AppAbility } from "@core/utils/ability";
import { ChannelGroupMapComponent } from "@features/channel-group/components/channel-group-map/channel-group-map.component";
import { FormsModule } from "@angular/forms";
import { UserService } from "@features/user/services/user.service";
import { MockUserService } from "@features/user/services/user.service.mock";
import { of } from "rxjs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

describe("ChannelGroupViewComponent", () => {
  let component: ChannelGroupViewComponent;
  let fixture: ComponentFixture<ChannelGroupViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxDatatableModule,
        FormsModule,
        LeafletModule,
        LeafletDrawModule,
        AbilityModule,
        MatSlideToggleModule,
      ],
      declarations: [ChannelGroupViewComponent, ChannelGroupMapComponent],
      providers: [
        { provide: UserService, useValue: new MockUserService() },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: { data: { channelGroups: [] } },
              data: of({ channelGroups: [] }),
            },
            firstChild: {
              snapshot: {
                params: {
                  id: 123,
                },
              },
            },
          },
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
        ChannelGroupService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
