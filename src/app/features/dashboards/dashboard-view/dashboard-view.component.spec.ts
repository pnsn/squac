import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewComponent } from './dashboard-view.component';
import { DashboardsService } from '../dashboards.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from 'src/app/user/ability';

describe('DashboardViewComponent', () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(async(() => {
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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
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
