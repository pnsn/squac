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
  paramsSub;
  constructor(
    private viewService: ViewService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.widgetId = +params.widgetid;
        const dashboardId = this.route.parent.parent.snapshot.paramMap.get('id');
        const widget = this.viewService.getWidget(this.widgetId);
        const statTypes = this.route.snapshot.data.statTypes;
        const metrics = this.route.snapshot.data.metrics;
        const channelGroups = this.route.snapshot.data.channelGroups;
    
            //get dashboard && widget from url
        this.dialogRef = this.dialog.open(WidgetEditComponent, {
          data : {
            widget,
            dashboardId,
            statTypes,
            metrics,
            channelGroups
          }
        });
      }

    );


    this.dialogRef.afterClosed().subscribe(
      result => {
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
    this.paramsSub.unsubscribe();
  }



}