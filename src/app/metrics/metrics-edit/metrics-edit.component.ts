import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Metric } from '../../shared/metric';
import { MetricsService } from '../../metrics.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators } from '@angular/forms';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit {
  id: number;
  metric: Metric;
  editMode : boolean;
  metricForm : FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private metricService : MetricsService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    )
  }

  private initForm() {
    let metricName = "";

    if (this.editMode) {
      const metric = this.metricService.getMetric(this.id);
      metricName = metric.name;
    }

    this.metricForm = new FormGroup({
      'name' : new FormControl(metricName, Validators.required)
    });
  }

  save() {
    //save metric
    this.metricService.updateMetric(this.id, this.metricForm.value);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
