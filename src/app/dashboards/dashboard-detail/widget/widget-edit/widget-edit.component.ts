import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit {
  id: number;
  editMode: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        console.log(this.editMode);
      }
    );
  }


  save() {
    // save it to dashboard
    this.cancel();
  }

  cancel() {
    if (this.editMode) {
      this.router.navigate(['../../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../../'], {relativeTo: this.route});
    }

  }
}
