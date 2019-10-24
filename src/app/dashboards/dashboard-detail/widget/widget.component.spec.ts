import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget } from '../../widget';
import { MeasurementPipe } from '../../measurement.pipe';
import { MeasurementsService } from '../../measurements.service';
import { ChannelGroup } from '../../../shared/channel-group';
import { TabularComponent } from './widget-types/tabular/tabular.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        NgxDatatableModule
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
      declarations: [WidgetComponent, MeasurementPipe, TabularComponent, LoadingComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.reload = new Subject<boolean>();
    component.widget = new Widget(
      1,
      'name',
      'description',
      1,
      1,
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
