import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MaterialModule} from '../../shared/material.module';
import { WidgetDetailComponent } from './widget-detail.component';
import { WidgetsModule } from '../widgets.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('WidgetDetailComponent', () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        WidgetsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
