import { Component, OnInit, OnDestroy } from '@angular/core';
import { Metric } from '@core/models/metric';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

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
    private formBuilder: FormBuilder,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit() {
    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.editMode = !!params.id;

        if (this.editMode) {
          this.id = +params.id;
          this.metric = this.route.snapshot.data.metric;
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
      sampleRate: new FormControl(''),
      minVal: new FormControl(''),
      maxVal: new FormControl('')
    });

    if (this.editMode) {
      this.metricForm.patchValue({
        name : this.metric.name,
        code: this.metric.code,
        description : this.metric.description,
        refUrl: this.metric.refUrl,
        unit : this.metric.unit,
        sampleRate: this.metric.sampleRate,
        minVal : this.metric.minVal,
        maxVal : this.metric.maxVal
      });
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
        values.sampleRate,
        values.minVal,
        values.maxVal
      )
    ).subscribe(
      result => {
        this.cancel();
      },
      error => {
        console.log('error in metrics edit updat: ' + error);
      }
    );
  }

  // Exit page
  // TODO: warn if unsaved
  cancel() {
    if (this.id) {
      this.router.navigate(['../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }

  }

  // Check if form has unsaved fields
  formUnsaved(e: Event) {
    e.preventDefault();
    if (this.metricForm.dirty) {
      this.confirmDialog.open(
        {
          title: 'Cancel editing',
          message: 'You have unsaved changes, if you cancel they will be lost.',
          cancelText: 'Keep editing',
          confirmText: 'Cancel'
        }
      );
      this.confirmDialog.confirmed().subscribe(
        confirm => {
          if (confirm) {
            this.cancel();
          }
      });
    } else {
      this.cancel();
    }
  }
}
