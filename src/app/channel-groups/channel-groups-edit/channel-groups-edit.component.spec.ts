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

describe('ChannelGroupsEditComponent', () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  
        RouterTestingModule.withRoutes([]), 
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ ChannelGroupsEditComponent ],
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
