import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsViewComponent } from './channel-groups-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroupsService } from '../../services/channel-groups.service';
import { ActivatedRoute } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MapComponent } from 'src/app/shared/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from 'src/app/core/utils/ability';

describe('ChannelGroupsViewComponent', () => {
  let component: ChannelGroupsViewComponent;
  let fixture: ComponentFixture<ChannelGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxDatatableModule,
        LeafletModule,
        LeafletDrawModule,
        AbilityModule
      ],
      declarations: [
        ChannelGroupsViewComponent,
        MapComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get(id: number) {
                  return 123;
                }
              }
            }
          }
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        ChannelGroupsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
