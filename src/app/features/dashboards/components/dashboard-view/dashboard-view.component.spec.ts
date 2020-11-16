import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewComponent } from './dashboard-view.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { MaterialModule } from '@shared/material.module';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { DashboardsService } from '../../services/dashboards.service';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';

describe('DashboardViewComponent', () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MaterialModule,
        AbilityModule
      ],
      declarations: [
        DashboardViewComponent,
        LoadingComponent
      ],
      providers: [
        DashboardsService,
        {provide: UserService, useClass: MockUserService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
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
            },
            params: of({id: 123}),

          }
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
