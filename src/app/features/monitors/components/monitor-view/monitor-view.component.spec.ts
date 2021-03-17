import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '@core/utils/ability';

import { MonitorViewComponent } from './monitor-view.component';

describe('MonitorViewComponent', () => {
  let component: MonitorViewComponent;
  let fixture: ComponentFixture<MonitorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorViewComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          snapshot: {

          },
          parent: {
            snapshot: {
              data: {
                monitors: []
              }
            }
          }
        }
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AbilityModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
