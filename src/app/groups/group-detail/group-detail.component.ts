import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GroupsService } from '../../groups.service';
import { Group } from '../../shared/group';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  id: number;
  group: Group;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupsService: GroupsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.group = this.groupsService.getGroup(this.id);
        //get metric
      }
    )
  }
  editMetric() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }


}
