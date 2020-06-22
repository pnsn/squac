import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetDetailComponent } from './widget-detail.component';
import { WidgetsModule } from '../../widgets.module';
import { RouterTestingModule } from '@angular/router/testing';
import { DataFormatService } from '../../services/data-format.service';

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
          provide: DataFormatService,
          useValue: {
            fetchData: () => {return; }
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
