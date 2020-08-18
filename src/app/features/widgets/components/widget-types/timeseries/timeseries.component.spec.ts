import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesComponent } from './timeseries.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Widget } from '@features/widgets/models/widget';

describe('TimeseriesComponent', () => {
  let component: TimeseriesComponent;
  let fixture: ComponentFixture<TimeseriesComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesComponent],
      imports: [NgxChartsModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(1, 2, 'name', 'description', 1, 1, 1, 1, 1, 1, 1, 1, []);
    component.data = {};
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
