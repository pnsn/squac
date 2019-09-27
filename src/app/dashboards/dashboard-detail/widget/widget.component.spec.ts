import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget } from '../../widget';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  
        RouterTestingModule.withRoutes([]), 
      ],
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        }
      ],
      declarations: [WidgetComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(
      1,
      "name"
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
