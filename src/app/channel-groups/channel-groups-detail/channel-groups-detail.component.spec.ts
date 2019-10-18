import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsDetailComponent } from './channel-groups-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroupsService } from '../channel-groups.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingComponent } from '../../shared/loading/loading.component';

describe('ChannelGroupsDetailComponent', () => {
  let component: ChannelGroupsDetailComponent;
  let fixture: ComponentFixture<ChannelGroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      declarations: [ ChannelGroupsDetailComponent , LoadingComponent],
      providers: [ ChannelGroupsService ,
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
    fixture = TestBed.createComponent(ChannelGroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
