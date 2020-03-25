import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsViewComponent } from './metrics-view.component';
import { Metric } from 'src/app/shared/metric';
import { of, Observable } from 'rxjs';
import { MetricsService } from 'src/app/shared/metrics.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockMetricsService } from 'src/app/shared/metrics.service.mock';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';

describe('MetricsViewComponent', () => {
  let component: MetricsViewComponent;
  let fixture: ComponentFixture<MetricsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxDatatableModule, AbilityModule],
      declarations: [ MetricsViewComponent ],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService},
        {provide: Ability, useValue: new Ability()}
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
