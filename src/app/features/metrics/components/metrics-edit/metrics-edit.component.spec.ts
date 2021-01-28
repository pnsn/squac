import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsEditComponent } from './metrics-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { of, Observable } from 'rxjs';
import { Metric } from '@core/models/metric';
import { MockMetricsService } from '@features/metrics/services/metrics.service.mock';
import { ActivatedRoute } from '@angular/router';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { MessageService } from '@core/services/message.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('MetricsEditComponent', () => {
  let component: MetricsEditComponent;
  let fixture: ComponentFixture<MetricsEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        AbilityModule,
        MatDialogModule
      ],
      declarations: [ MetricsEditComponent ],
      providers: [
        ConfirmDialogService,
        {provide: MetricsService, useClass: MockMetricsService},
                { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
