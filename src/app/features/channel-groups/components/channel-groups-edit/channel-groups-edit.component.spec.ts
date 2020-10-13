import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsEditComponent } from './channel-groups-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroupsService } from '../../services/channel-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelsService } from '../../services/channels.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NetworksService } from '../../services/networks.service';
import { of } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { MaterialModule } from '@shared/material.module';
import { MapComponent } from '../../../../shared/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { ChannelGroupsFilterComponent } from './channel-groups-filter/channel-groups-filter.component';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChannelGroupsEditComponent', () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        MaterialModule,
        LeafletModule,
        LeafletDrawModule,
        AbilityModule
      ],
      declarations: [
        ChannelGroupsEditComponent,
        LoadingComponent,
        ChannelGroupsFilterComponent,
        MapComponent
      ],
      providers: [
        ChannelGroupsService,
        ChannelsService,
        NetworksService,
        {provide: UserService, useClass: MockUserService},
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
