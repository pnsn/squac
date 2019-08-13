import { Component, OnInit } from '@angular/core';
import { Metric } from '../../shared/metric';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MetricsService } from '../../shared/metrics.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit {
  id: number;
  metric: Metric;
  editMode: boolean;
  metricForm: FormGroup;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private metricsService : MetricsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    let metricName = "";
    let metricDescription = "";
    let metricSource = "";
    let metricUnit = "";

    if (this.editMode) {
      const metric = this.metricsService.getMetric(this.id);
      metricName = metric.name;
      metricDescription = metric.description;
      metricSource = metric.source;
      metricUnit = metric.unit;
    } 

    this.metricForm = this.formBuilder.group({
      'name' : new FormControl(metricName, Validators.required),
      'description': new FormControl(metricDescription, Validators.required),
      'source': new FormControl(metricSource, Validators.required),
      'unit': new FormControl(metricUnit, Validators.required)
    });

  }
  // Save channel information
  save() {
    let values = this.metricForm.value;
    this.metricsService.updateMetric(
      this.id, 
      new Metric(
        this.id,
        values.name,
        values.description, 
        values.source,
        values.unit
      )
    );
    this.cancel();
  }

  // Exit page
  //TODO: warn if unsaved
  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
