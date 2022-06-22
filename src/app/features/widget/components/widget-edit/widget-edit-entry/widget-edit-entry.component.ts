import { Component, OnInit, OnDestroy } from "@angular/core";
import { WidgetEditComponent } from "../widget-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
  selector: "widget-edit-entry",
  template: "",
})
export class WidgetEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  widgetId;
  paramsSub;
  dashboardId;
  metrics;
  channelGroups;
  widget;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.widgetId = +params.widgetId;
      this.dashboardId = +params.dashboardId;
      const snapshot = this.route.snapshot;
      if (snapshot.data) {
        this.metrics = snapshot.data.metrics;
        this.channelGroups = snapshot.data.channelGroups;
        this.widget = snapshot.data.widget;
      }

      this.openWidget();
    });
  }

  openWidget() {
    if (this.dashboardId && this.metrics && this.channelGroups) {
      // get dashboard && widget from url
      this.dialogRef = this.dialog.open(WidgetEditComponent, {
        closeOnNavigation: true,
        maxWidth: 800,
        data: {
          widget: this.widget,
          dashboardId: this.dashboardId,
          metrics: this.metrics,
          channelGroups: this.channelGroups,
        },
      });

      this.dialogRef.afterClosed().subscribe(
        () => {
          if (this.widgetId) {
            this.router.navigate(["../../../"], { relativeTo: this.route });
          } else {
            this.router.navigate(["../"], { relativeTo: this.route });
          }
          // route to exit
        },
        (error) => {
          console.log("error in widget detail: " + error);
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
