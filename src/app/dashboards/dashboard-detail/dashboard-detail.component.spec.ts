import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DashboardsService } from '../dashboards.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetComponent } from '../../widgets/widget.component';
import { MeasurementPipe } from '../../widgets/measurement.pipe';
import { TabularComponent } from '../../widgets/widget-detail/widget-types/tabular/tabular.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/shared/material.module';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { AppAbility } from 'src/app/user/ability';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';


describe('DashboardDetailComponent', () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FormsModule,
        NgxDatatableModule,
        WidgetsModule,
        AbilityModule
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
      ],
      declarations: [
        DashboardDetailComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
