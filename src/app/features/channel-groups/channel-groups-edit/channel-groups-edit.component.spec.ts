import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsEditComponent } from './channel-groups-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroupsService } from '../channel-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelsService } from '../../../core/services/channels.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NetworksService } from '../networks.service';
import { of } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ChannelGroupsTableComponent } from './channel-groups-table/channel-groups-table.component';
import { ChannelGroupsFilterComponent } from './channel-groups-filter/channel-groups-filter.component';
import { MapComponent } from '../../../shared/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from 'src/app/core/utils/ability';

describe('ChannelGroupsEditComponent', () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
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
        ChannelGroupsTableComponent,
        ChannelGroupsFilterComponent,
        MapComponent
      ],
      providers: [
        ChannelGroupsService,
        ChannelsService,
        NetworksService,
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
