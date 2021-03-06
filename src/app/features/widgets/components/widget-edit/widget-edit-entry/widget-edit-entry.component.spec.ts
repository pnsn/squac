import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetEditEntryComponent } from './widget-edit-entry.component';
import { ViewService } from '@core/services/view.service';
import { MockViewService } from '@core/services/view.service.mock';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WidgetEditEntryComponent', () => {
  let component: WidgetEditEntryComponent;
  let fixture: ComponentFixture<WidgetEditEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetEditEntryComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: ViewService, useClass: MockViewService},
        {provide: ActivatedRoute, useValue: {
          params: of({id: 1})
        }
      }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
