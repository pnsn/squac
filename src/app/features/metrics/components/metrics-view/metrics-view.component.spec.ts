import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsViewComponent } from './metrics-view.component';
import { Metric } from '@core/models/metric';
import { of, Observable } from 'rxjs';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMetricsService } from '@features/metrics/services/metrics.service.mock';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';

describe('MetricsViewComponent', () => {
  let component: MetricsViewComponent;
  let fixture: ComponentFixture<MetricsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxDatatableModule, AbilityModule],
      declarations: [ MetricsViewComponent ],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService},
                { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
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
