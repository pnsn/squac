import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';

import { MonitorChartComponent } from './monitor-chart.component';

describe('MonitorChartComponent', () => {
  let component: MonitorChartComponent;
  let fixture: ComponentFixture<MonitorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorChartComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService, useValue: new MockSquacApiService()}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
