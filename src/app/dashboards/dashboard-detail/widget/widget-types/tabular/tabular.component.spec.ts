import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularComponent } from './tabular.component';
import { MeasurementPipe } from '../../../../measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MeasurementsService } from '../../../../measurements.service';
import { EMPTY, of, Subject } from 'rxjs';

describe('TabularComponent', () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularComponent , MeasurementPipe],
      imports: [NgxDatatableModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.columns=[];
    component.rows=[];
    component.metrics = [];
    component.channels = [];
    component.dataUpdate = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
