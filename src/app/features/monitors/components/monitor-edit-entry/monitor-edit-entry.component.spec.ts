import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@shared/material.module';
import { SharedModule } from '@shared/shared.module';
import { of } from 'rxjs';
import { MonitorChartComponent } from '../monitor-chart/monitor-chart.component';
import { MonitorEditComponent } from '../monitor-edit/monitor-edit.component';

import { MonitorEditEntryComponent } from './monitor-edit-entry.component';

describe('MonitorEditEntryComponent', () => {
  let component: MonitorEditEntryComponent;
  let fixture: ComponentFixture<MonitorEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MonitorEditEntryComponent,
        MonitorEditComponent,
        MonitorChartComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {
          params: of({id: 1})
        }
      }
    ]
  }
    )
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
