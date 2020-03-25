import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget } from './widget';
import { MeasurementsService } from './measurements.service';
import { WidgetsModule } from './widgets.module';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';
import { MockMeasurementsService } from './measurements.service.mock';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        WidgetsModule,
        AbilityModule
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
          useClass: MockMeasurementsService
        },
        {provide: Ability, useValue: new Ability()}
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
