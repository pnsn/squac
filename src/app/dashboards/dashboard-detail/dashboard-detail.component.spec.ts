import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailComponent } from './dashboard-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DashboardsService } from '../dashboards.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetComponent } from './widget/widget.component';

describe('DashboardDetailComponent', () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  
        RouterTestingModule.withRoutes([]), 
        HttpClientTestingModule
      ],
      providers: [ 
        DashboardsService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        }
      ],
      declarations: [
        DashboardDetailComponent,
        WidgetComponent
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
