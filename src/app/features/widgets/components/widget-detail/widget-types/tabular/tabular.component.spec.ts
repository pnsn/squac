import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularComponent } from './tabular.component';
import { MeasurementPipe } from '../../../../pipes/measurement.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataFormatService } from 'src/app/features/widgets/services/data-format.service';
import { Widget } from 'src/app/core/models/widget';

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
