import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MetricGroup } from '../../shared/metric-group';
import { MetricGroupsService } from '../../metric-groups.service';
import { FormGroup, FormControl, FormArray, FormGroupName, Validators } from '@angular/forms';

@Component({
  selector: 'app-metric-group-edit',
  templateUrl: './metric-groups-edit.component.html',
  styleUrls: ['./metric-groups-edit.component.scss']
}) 
export class MetricGroupsEditComponent implements OnInit {
  id: number;
  metricGroup: MetricGroup;
  editMode : boolean;
  metricGroupForm : FormGroup;
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
    let metricGroupName = "";

    if (this.editMode) {
      const metricGroup = this.metricGroupService.getMetricGroup(this.id);
      metricGroupName = metricGroup.name;
    }

    this.metricGroupForm = new FormGroup({
      'name' : new FormControl(metricGroupName, Validators.required)
    });
  }

  save() {
    //save metric
    this.metricGroupService.updateMetricGroup(this.id, this.metricGroupForm.value);
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
