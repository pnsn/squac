import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget } from './widget';
import { MeasurementPipe } from './measurement.pipe';
import { MeasurementsService } from './measurements.service';
import { ChannelGroup } from '../shared/channel-group';
import { TabularComponent } from './widget-detail/widget-types/tabular/tabular.component';
import { LoadingComponent } from '../shared/loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'src/app/shared/material.module';
import { GridsterModule } from 'angular-gridster2';
import { WidgetsModule } from './widgets.module';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        WidgetsModule
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widgets = [
      {
        cols: 1,
        rows: 1,
        x: 0,
        y: 0,
        widget: new Widget(
          1,
          'name',
          'description',
          1,
          1,
          1,
          1,
          1,
          []
        )
      }
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
