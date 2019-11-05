import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent } from './timeline.component';
import { MeasurementPipe } from 'src/app/widgets/measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineComponent , MeasurementPipe],
      imports: [NgxDatatableModule, MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    component.metrics = [];
    component.channels = [];
    component.startdate = new Date();
    component.enddate = new Date();
    component.dataUpdate = new Subject();
    component.resize = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
