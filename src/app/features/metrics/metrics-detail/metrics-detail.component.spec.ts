import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDetailComponent } from './metrics-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MetricsService } from 'src/app/shared/metrics.service';
import { of, Observable } from 'rxjs';
import { Metric } from 'src/app/shared/metric';
import { MockMetricsService } from 'src/app/shared/metrics.service.mock';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from 'src/app/core/utils/ability';

describe('MetricsDetailComponent', () => {
  let component: MetricsDetailComponent;
  let fixture: ComponentFixture<MetricsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AbilityModule
      ],
      declarations: [ MetricsDetailComponent ],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService },
                { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
