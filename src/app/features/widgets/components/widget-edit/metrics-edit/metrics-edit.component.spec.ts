import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsEditComponent } from './metrics-edit.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { WidgetEditService } from '../../../services/widget-edit.service';

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
            getMetricIds: () => [],
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
