import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsDetailComponent } from './channel-groups-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChannelGroup } from '@core/models/channel-group';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChannelGroupMapComponent } from '../channel-group-map/channel-group-map.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserPipe } from '@shared/pipes/user.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { MockOrganizationsService } from '@features/user/services/organizations.service.mock';
import { OrganizationPipe } from '@shared/pipes/organization.pipe';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { AppAbility } from '@core/utils/ability';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

describe('ChannelGroupsDetailComponent', () => {
  let component: ChannelGroupsDetailComponent;
  let fixture: ComponentFixture<ChannelGroupsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelGroupsDetailComponent,
        ChannelGroupMapComponent,
        UserPipe,
        OrganizationPipe],
      imports: [
        NgxDatatableModule, 
        RouterTestingModule, 
        HttpClientTestingModule,
        AbilityModule],
      providers: [
        {
          provide: OrganizationsService, useValue: new MockOrganizationsService()
        },
        {
          provide: UserService, useValue: new MockUserService()
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        {
          provide: ActivatedRoute,
          useValue: {
            data : of({channelGroup : new ChannelGroup(
              1,
              1,
              'name',
              'description',
              1,
              false,
              false,
              []
            )})
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
