import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent } from './timeline.component';
import { MeasurementPipe } from 'src/app/widgets/measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Subject, of } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineComponent , MeasurementPipe],
      imports: [NgxDatatableModule, MatTooltipModule, HttpClientTestingModule],
      providers: [
        {
          provide: DataFormatService,
          useValue: {
            formattedData: of()
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
    component.channelGroup = new ChannelGroup(
      1,
      '',
      '',
      []
    );
    fixture.detectChanges();
    component.startdate = new Date();
    component.enddate = new Date();
    component.resize = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
