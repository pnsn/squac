import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdEditComponent } from './threshold-edit.component';
import {MatListModule } from '@angular/material/list';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { WidgetEditService } from '../widget-edit.service';
import { of } from 'rxjs';

describe('ThresholdEditComponent', () => {
  let component: ThresholdEditComponent;
  let fixture: ComponentFixture<ThresholdEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxDatatableModule],
      declarations: [ ThresholdEditComponent ],
      providers: [
        {
          provide: WidgetEditService,
          useValue: {
            metrics: of([]),
            getThresholds: () => null
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
