import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularComponent } from './tabular.component';
import { MeasurementPipe } from '../../../measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MeasurementsService } from '../../../measurements.service';
import { EMPTY, of, Subject } from 'rxjs';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';

describe('TabularComponent', () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularComponent , MeasurementPipe],
      imports: [NgxDatatableModule],
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
            getChannelGroup: ()=>{return {channels : []};}
          }
        }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.columns = [];
    component.rows = [];
    component.metrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
