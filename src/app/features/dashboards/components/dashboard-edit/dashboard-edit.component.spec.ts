import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Dashboard } from '@features/dashboards/models/dashboard';

describe('DashboardEditComponent', () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
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
            data : of({}),
            snapshot : {
              data: {dashboard: new Dashboard(
                1,
                1,
                'name',
                'description',
                false,
                false,
                1,
                []
              )}
            }
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
