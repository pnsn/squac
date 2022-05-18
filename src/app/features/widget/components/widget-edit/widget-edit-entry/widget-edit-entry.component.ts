import { Component, OnInit, OnDestroy } from "@angular/core";
import { WidgetEditComponent } from "../widget-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { WidgetService } from "@widget/services/widget.service";

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
    private router: Router,
    private widgetService: WidgetService
  ) {}

  ngOnInit(): void {
    console.log("Init");
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.widgetId = +params.widgetId;

      if (this.route.parent) {
        this.dashboardId =
          this.route.parent.parent.snapshot.paramMap.get("dashboardId");
      }
      if (this.route.snapshot && this.route.snapshot.data) {
        this.metrics = this.route.snapshot.data.metrics;
        this.channelGroups = this.route.snapshot.data.channelGroups;
      }

      if (this.widgetId) {
        this.widgetService.getWidget(this.widgetId).subscribe((widget) => {
          this.widget = widget;
          this.openWidget();
        });
      } else {
        this.openWidget();
      }
    });
  }

  openWidget() {
    if (this.dashboardId && this.metrics && this.channelGroups) {
      // get dashboard && widget from url
      this.dialogRef = this.dialog.open(WidgetEditComponent, {
        width: "70vw",
        closeOnNavigation: true,
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
