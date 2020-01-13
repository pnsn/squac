import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsEditComponent } from './metrics-edit.component';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MetricsService } from 'src/app/shared/metrics.service';
import { WidgetEditService } from '../widget-edit.service';

describe('MetricsEditComponent', () => {
  let component: MetricsEditComponent;
  let fixture: ComponentFixture<MetricsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule, HttpClientTestingModule],
      providers: [
        MetricsService,
        {
          provide: WidgetEditService,
          useValue: {
            getMetricIds: ()=>{return [];},
          }
        }
      ],
      declarations: [ MetricsEditComponent , LoadingComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
