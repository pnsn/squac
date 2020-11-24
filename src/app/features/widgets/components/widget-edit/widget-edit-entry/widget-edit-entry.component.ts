import { Component, OnInit, OnDestroy } from '@angular/core';
import { WidgetEditComponent } from '../widget-edit.component';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WidgetsService } from '@features/widgets/services/widgets.service';

@Component({
  selector: 'app-widget-edit-entry',
  templateUrl: './widget-edit-entry.component.html',
  styleUrls: ['./widget-edit-entry.component.scss']
})
export class WidgetEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  widgetId;
  paramsSub;
  dashboardId;
  statTypes;
  metrics;
  channelGroups;
  widget;

  constructor(
    private viewService: ViewService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private widgetsService: WidgetsService
  ) { }

  ngOnInit(): void {

    this.paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.widgetId = +params.widgetid;


        if (this.route.parent) {
          this.dashboardId = this.route.parent.parent.snapshot.paramMap.get('id');
        }
        if (this.route.snapshot && this.route.snapshot.data) {
          this.statTypes = this.route.snapshot.data.statTypes;
          this.metrics = this.route.snapshot.data.metrics;
          this.channelGroups = this.route.snapshot.data.channelGroups;
        }

        this.widget = this.viewService.getWidget(this.widgetId);

        if (this.widgetId && !this.widget){
          this.widgetsService.getWidget(this.widgetId).subscribe(
            widget => {
              this.widget = widget;
              this.openWidget();
            }
          );
        } else {
          this.openWidget();
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

  openWidget( ) {
    if (this.dashboardId && this.statTypes && this.metrics && this.channelGroups) {
      // get dashboard && widget from url
      this.dialogRef = this.dialog.open(WidgetEditComponent, {
        closeOnNavigation: true,
        data : {
          widget: this.widget,
          dashboardId: this.dashboardId,
          statTypes: this.statTypes,
          metrics: this.metrics,
          channelGroups: this.channelGroups
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }



}
