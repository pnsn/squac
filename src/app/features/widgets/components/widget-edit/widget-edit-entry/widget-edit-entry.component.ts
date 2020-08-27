import { Component, OnInit } from '@angular/core';
import { WidgetEditComponent } from '../widget-edit.component';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-widget-edit-entry',
  templateUrl: './widget-edit-entry.component.html',
  styleUrls: ['./widget-edit-entry.component.scss']
})
export class WidgetEditEntryComponent implements OnInit {
  dialogRef;
  widgetId;
  widget;
  dashboardId;
  constructor(
    private viewService: ViewService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit(): void {

    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.widgetId = +params.widgetid;
        this.dashboardId = this.route.parent.parent.snapshot.paramMap.get('id');
        this.widget = this.route.snapshot.data.widget;

            //get dashboard && widget from url
        this.dialogRef = this.dialog.open(WidgetEditComponent, {
          data : {
            widget: this.widget,
            dashboardId: this.dashboardId
          }
        });
      }
    );


    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          this.viewService.updateWidget(result.id);
        } else {
          console.log('widget edit closed without saving');
        }
        if(this.widgetId) {
          this.router.navigate(['../../../'], {relativeTo: this.route});
        } else {
          this.router.navigate(['../'], {relativeTo: this.route});
        }

        //route to exit
      }, error => {
        console.log('error in widget detail: ' + error);
      }
    );

  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }



}
