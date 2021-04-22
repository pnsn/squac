import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '@core/utils/ability';
import { MaterialModule } from '@shared/material.module';
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
        AbilityModule,
        HttpClientTestingModule,
        NgxDatatableModule,
        MaterialModule,
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        { provide: ActivatedRoute,
        useValue: {
          parent: {
            data : of()
          },
          snapshot : {}
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
