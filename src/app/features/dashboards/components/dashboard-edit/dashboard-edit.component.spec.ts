import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEditComponent } from './dashboard-edit.component';
import { DashboardsService } from '../../services/dashboards.service';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@shared/material.module';
import { MockDashboardsService } from '@features/dashboards/services/dashboards.service.mock';
import { MockUserService } from '@features/user/services/user.service.mock';
import { UserService } from '@features/user/services/user.service';

describe('DashboardEditComponent', () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      declarations: [ DashboardEditComponent ],
      providers: [
        {provide: DashboardsService, useClass: MockDashboardsService},
        {provide: UserService, useClass: MockUserService},
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123}),
            data : of({})
          }
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
