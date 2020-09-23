import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsDetailComponent } from './channel-groups-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChannelGroup } from '@core/models/channel-group';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MapComponent } from '@shared/map/map.component';

describe('ChannelGroupsDetailComponent', () => {
  let component: ChannelGroupsDetailComponent;
  let fixture: ComponentFixture<ChannelGroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGroupsDetailComponent, MapComponent ],
      imports: [NgxDatatableModule],
      providers: [
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
