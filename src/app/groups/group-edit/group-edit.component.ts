import { Component, OnInit } from '@angular/core';
import { Group } from '../../shared/group';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MetricGroupsService } from '../../metric-groups.service';
import { GroupsService } from '../../groups.service';
import { MetricGroup } from '../../shared/metric-group';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  id: number;
  group: Group;
  metricGroup: MetricGroup;
  editMode : boolean;
  groupForm : FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private metricGroupService : MetricGroupsService, private groupService : GroupsService) { }

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
    let groupName = "";
    let groupMetricGroups = new FormArray([]);

    if (this.editMode) {
      const group = this.groupService.getGroup(this.id);
      groupName = group.name;
      if (group['metricGroups']) {
        for( let metricGroup of group.metricGroups) {
          groupMetricGroups.push(
            new FormGroup({
              'name': new FormControl(metricGroup.name, Validators.required)
            })
          );
        }
      }
    }
    this.groupForm = new FormGroup({
      'name' : new FormControl(groupName, Validators.required),
      'metricGroups' : groupMetricGroups
    });
  }

  addMetric() {
    (<FormArray>this.groupForm.get('metricGroups')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required)
      })
    )
  }

  getControls() {
    return (<FormArray>this.groupForm.get('metricGroups')).controls;
  }

  deleteMetric(index:number) {
    (<FormArray>this.groupForm.get('metricGroups')).removeAt(index);
  }

  save() {
    //save metric
    let id = this.groupService.updateGroup(this.id, this.groupForm.value);
    
    if(this.editMode) {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../' + id], {relativeTo: this.route});
    }
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
