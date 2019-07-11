import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss']
})
export class MetricDetailComponent implements OnInit {
  id: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        //get metric
      }
    )
  }
  editMetric() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
