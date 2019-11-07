import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent } from './timeline.component';
import { MeasurementPipe } from 'src/app/widgets/measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Subject, of } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineComponent , MeasurementPipe],
      imports: [NgxDatatableModule, MatTooltipModule],
      providers: [
        {
          provide: DataFormatService,
          useValue: {
            formattedData: of()
          }
        },
        {
          provide: ViewService,
          useValue: {
            getChannelGroup: () => ({channels : []})
          }
        }

      ]
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
    component.resize = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
