import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DashboardsService } from '../../services/dashboards.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppAbility } from '@core/utils/ability';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { WidgetsModule } from '@features/widgets/widgets.module';
import { ViewService } from '@core/services/view.service';
import { MockViewService } from '@core/services/view.service.mock';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserPipe } from '@shared/pipes/user.pipe';
import { OrganizationPipe } from '@shared/pipes/organization.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('DashboardDetailComponent', () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FormsModule,
        NgxDatatableModule,
        WidgetsModule,
        AbilityModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        NgxDaterangepickerMd.forRoot(),
        MatProgressBarModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule
      ],
      providers: [
        DashboardsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123}),
            data: of({dashboard: new Dashboard(
              1,
              1,
              'name',
              'description',
              false,
              false,
              1,
              []
            )})
          }
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        {provide: ViewService, useValue: new MockViewService()}
      ],
      declarations: [
        DashboardDetailComponent,
        UserPipe,
        OrganizationPipe
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
