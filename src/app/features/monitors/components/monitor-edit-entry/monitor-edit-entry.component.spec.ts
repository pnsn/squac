import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MonitorEditEntryComponent } from './monitor-edit-entry.component';

describe('MonitorEditEntryComponent', () => {
  let component: MonitorEditEntryComponent;
  let fixture: ComponentFixture<MonitorEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorEditEntryComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        HttpClientTestingModule,
        ReactiveFormsModule
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
