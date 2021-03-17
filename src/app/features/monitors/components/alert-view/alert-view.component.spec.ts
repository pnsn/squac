import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { of } from 'rxjs';

import { AlertViewComponent } from './alert-view.component';

describe('AlertViewComponent', () => {
  let component: AlertViewComponent;
  let fixture: ComponentFixture<AlertViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertViewComponent ],
      imports : [
        HttpClientTestingModule,
        NgxDatatableModule],
      providers: [ {
        provide: ActivatedRoute,
        useValue: {
          data : of({
            monitor: {}
          })
        }
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
