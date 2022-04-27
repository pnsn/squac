import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupDetailComponent } from "./channel-group-detail.component";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { ChannelGroup } from "@core/models/channel-group";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChannelGroupMapComponent } from "@channelGroup/components/channel-group-map/channel-group-map.component";
import { RouterTestingModule } from "@angular/router/testing";
import { UserPipe } from "@shared/pipes/user.pipe";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { OrganizationService } from "@user/services/organization.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserService } from "@user/services/user.service";
import { MockUserService } from "@user/services/user.service.mock";
import { AppAbility } from "@core/utils/ability";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MockProvider } from "ng-mocks";

describe("ChannelGroupDetailComponent", () => {
  let component: ChannelGroupDetailComponent;
  let fixture: ComponentFixture<ChannelGroupDetailComponent>;
  let router;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelGroupDetailComponent,
        ChannelGroupMapComponent,
        UserPipe,
        OrganizationPipe,
      ],
      imports: [
        NgxDatatableModule,
        RouterTestingModule.withRoutes([
          { path: "edit", component: ChannelGroupDetailComponent },
        ]),
        HttpClientTestingModule,
        AbilityModule,
        LeafletModule,
        LeafletDrawModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        MockProvider(OrganizationService),
        {
          provide: UserService,
          useValue: new MockUserService(),
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            data: of({
              channelGroup: new ChannelGroup(
                1,
                1,
                "name",
                "description",
                1,
                []
              ),
            }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to channel group", () => {
    const routerSpy = spyOn(router, "navigate");
    component.editChannelGroup();
    expect(routerSpy).toHaveBeenCalled();
  });
});
