import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget } from '../../widget';
import { MeasurementPipe } from '../../measurement.pipe';
import { MeasurementsService } from '../../measurements.service';
import { ChannelGroup } from '../../../shared/channel-group';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        },
        {
          provide: MeasurementsService,
          useValue: {
            getMeasurements(metricsString, channelsString, startdate, enddate ) {
              return EMPTY;
            }
          }
        }
      ],
      declarations: [WidgetComponent, MeasurementPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(
      1,
      'name',
      []
    );

    component.channelGroup = new ChannelGroup(
      1,
      'name',
      'description',
      []
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
