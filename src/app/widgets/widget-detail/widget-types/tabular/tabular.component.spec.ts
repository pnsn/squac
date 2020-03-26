import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularComponent } from './tabular.component';
import { MeasurementPipe } from '../../../measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MeasurementsService } from '../../../measurements.service';
import { EMPTY, of, Subject } from 'rxjs';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Widget } from 'src/app/widgets/widget';

describe('TabularComponent', () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabularComponent , MeasurementPipe],
      imports: [NgxDatatableModule, HttpClientTestingModule],
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
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.columns = [];
    component.rows = [];
    component.widget = new Widget(1, 1, 'name', 'description', 1, 1, 1, 1, 1, 1, 1, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
