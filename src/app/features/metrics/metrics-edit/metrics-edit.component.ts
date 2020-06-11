import { Component, OnInit, OnDestroy } from '@angular/core';
import { Metric } from '../../../core/models/metric';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MetricsService } from '../../../core/services/metrics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit, OnDestroy {
  id: number;
  metric: Metric;
  editMode: boolean;
  metricForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metricsService: MetricsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.editMode = !!params.id;

        if (this.editMode) {
          this.id = +params.id;
        }

        this.initForm();
      },
      error => {
        console.log('error in metrics edit: ' + error);
      }
    );

    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm() {
    this.metricForm = this.formBuilder.group({
      name : new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      refUrl: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
      minVal: new FormControl(''),
      maxVal: new FormControl('')
    });

    if (this.editMode) {
      this.metricsService.getMetric(this.id).subscribe(
        metric => {
          this.metricForm.patchValue({
            name : metric.name,
            code: metric.code,
            description : metric.description,
            refUrl: metric.refUrl,
            unit : metric.unit,
            minVal : metric.minVal,
            maxVal : metric.maxVal
          });
        },
        error => {
          console.log('error in metrics edit: ' + error);
        }
      );
    }
  }
  // Save channel information
  save() {
    const values = this.metricForm.value;
    this.metricsService.updateMetric(
      new Metric(
        this.id,
        null,
        values.name,
        values.code,
        values.description,
        values.refUrl,
        values.unit,
        values.minVal,
        values.maxVal
      )
    ).subscribe(
      result => {
        this.cancel(result.id);
      },
      error => {
        console.log('error in metrics edit updat: ' + error);
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(['../../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../../'], {relativeTo: this.route});
    }
  }

  // Check if form has unsaved fields
  formUnsaved() {
    if (this.metricForm.dirty) {
      const popup = document.getElementById('metric-popup');
      popup.style.display = 'block';
    } else {
      this.cancel();
    }
  }

  closePopup() {
    const popup = document.getElementById('metric-popup');
    popup.style.display = 'none';
  }
}
