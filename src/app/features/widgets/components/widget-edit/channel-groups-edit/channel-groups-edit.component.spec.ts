import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupsEditComponent } from "./channel-groups-edit.component";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { WidgetEditService } from "@features/widgets/services/widget-edit.service";
import { MockWidgetEditService } from "@features/widgets/services/widget-edit.service.mock";
import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";
import { MockChannelGroupsService } from "@features/channel-groups/services/channel-groups.service.mock";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { UserService } from "@features/user/services/user.service";
import { MockUserService } from "@features/user/services/user.service.mock";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { MockOrganizationsService } from "@features/user/services/organizations.service.mock";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChannelGroup } from "@core/models/channel-group";

describe("ChannelGroupsEditComponent", () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          MatSlideToggleModule,
          HttpClientTestingModule,
          NgxDatatableModule,
          FormsModule
        ],
        declarations: [ChannelGroupsEditComponent, LoadingComponent],
        providers: [
          { provide: WidgetEditService, useValue: new MockWidgetEditService() },
          { provide: ChannelGroupsService, useClass: MockChannelGroupsService },
          { provide: UserService, useValue: new MockUserService() },
          {
            provide: OrganizationsService,
            useValue: new MockOrganizationsService(),
          },
        ],
      }).compileComponents();
    })
  );

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
