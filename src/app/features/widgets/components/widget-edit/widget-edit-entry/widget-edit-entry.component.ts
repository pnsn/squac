import { Component, OnInit, OnDestroy } from '@angular/core';
import { WidgetEditComponent } from '../widget-edit.component';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-widget-edit-entry',
  templateUrl: './widget-edit-entry.component.html',
  styleUrls: ['./widget-edit-entry.component.scss']
})
export class WidgetEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  widgetId;
  paramsSub;
  constructor(
    private viewService: ViewService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('loaded widget edit entry');
    this.paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.widgetId = +params.widgetid;
        let dashboardId;
        let statTypes;
        let metrics;
        let channelGroups;

        if (this.route.parent) {
          dashboardId = this.route.parent.parent.snapshot.paramMap.get('id');
        }
        if (this.route.snapshot.data) {
          statTypes = this.route.snapshot.data.statTypes;
          metrics = this.route.snapshot.data.metrics;
          channelGroups = this.route.snapshot.data.channelGroups;
        }

        const widget = this.viewService.getWidget(this.widgetId);
        if (dashboardId && statTypes && metrics && channelGroups) {
            // get dashboard && widget from url
            this.dialogRef = this.dialog.open(WidgetEditComponent, {
              data : {
                widget,
                dashboardId,
                statTypes,
                metrics,
                channelGroups
              }
            });
        } else {
          // show error
        }


      }
    );

    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(
        result => {
          if (this.widgetId) {
            this.router.navigate(['../../../'], {relativeTo: this.route});
          } else {
            this.router.navigate(['../'], {relativeTo: this.route});
          }
          // route to exit
        }, error => {
          console.log('error in widget detail: ' + error);
        }
      );
    }



  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }



}
