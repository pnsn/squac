import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsComponent } from './channel-groups.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroupsService } from './channel-groups.service';
import { NetworksService } from './networks.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ChannelGroupsComponent', () => {
  let component: ChannelGroupsComponent;
  let fixture: ComponentFixture<ChannelGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  
        RouterTestingModule.withRoutes([]), 
        HttpClientTestingModule
      ],
      declarations: [ ChannelGroupsComponent ],
      providers: [ 
        ChannelGroupsService,
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
    fixture = TestBed.createComponent(ChannelGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
