import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsComponent } from './dashboards.component';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardViewComponent } from '@features/dashboards/components/dashboard-view/dashboard-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingComponent } from '@shared/loading/loading.component';
import { MaterialModule } from '@shared/material.module';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '@core/utils/ability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardsComponent;
  let fixture: ComponentFixture<DashboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        MaterialModule,
        AbilityModule
      ],
      declarations: [ DashboardsComponent , DashboardViewComponent],
      providers: [
        DashboardsService,
                { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
