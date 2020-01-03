import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsEditComponent } from './channel-groups-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroupsService } from '../channel-groups.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelsService } from '../../shared/channels.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NetworksService } from '../networks.service';
import { of } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ChannelGroupsTableComponent } from './channel-groups-table/channel-groups-table.component';
import { ChannelGroupsFilterComponent } from './channel-groups-filter/channel-groups-filter.component';
import { MapComponent } from '../../shared/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
        LeafletModule
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
        }]
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
