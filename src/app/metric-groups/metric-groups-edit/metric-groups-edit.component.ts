import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Metric } from '../../shared/metric';
import { MetricGroupsService } from '../../metric-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators } from '@angular/forms';

@Component({
  selector: 'app-metric-group-edit',
  templateUrl: './metric-groups-edit.component.html',
  styleUrls: ['./metric-groups-edit.component.scss']
}) 
export class MetricGroupsEditComponent implements OnInit {
  id: number;
  metric: Metric;
  editMode : boolean;
  metricForm : FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private metricGroupService : MetricGroupsService) { }

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
      const metric = this.metricGroupService.getMetric(this.id);
      metricName = metric.name;
    }

    this.metricForm = new FormGroup({
      'name' : new FormControl(metricName, Validators.required)
    });
  }

  save() {
    //save metric
    this.metricGroupService.updateMetric(this.id, this.metricForm.value);
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
