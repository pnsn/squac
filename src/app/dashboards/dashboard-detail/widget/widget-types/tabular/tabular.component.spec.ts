import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularComponent } from './tabular.component';
import { MeasurementPipe } from '../../../../measurement.pipe';

describe('TabularComponent', () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularComponent , MeasurementPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.data = {};
    component.metrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
