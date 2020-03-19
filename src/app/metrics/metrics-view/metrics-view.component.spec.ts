import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsViewComponent } from './metrics-view.component';
import { Metric } from 'src/app/shared/metric';
import { of, Observable } from 'rxjs';
import { MetricsService } from 'src/app/shared/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMetricsService } from 'src/app/shared/metrics.service.mock';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('MetricsViewComponent', () => {
  let component: MetricsViewComponent;
  let fixture: ComponentFixture<MetricsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxDatatableModule],
      declarations: [ MetricsViewComponent ],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
