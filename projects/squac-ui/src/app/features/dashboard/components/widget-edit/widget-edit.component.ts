import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric, Params } from "squacapi";
import { MessageService } from "@core/services/message.service";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetService } from "squacapi";
import { Widget } from "widgets";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * Widget edit main component
 */
@Component({
  selector: "widget-edit",
  templateUrl: "./widget-edit.component.html",
  styleUrls: ["./widget-edit.component.scss"],
})
export class WidgetEditComponent implements OnDestroy, OnInit {
  subscriptions: Subscription = new Subscription();

  id: number;
  widget: Widget;
  metrics: Metric[];
  editMode: boolean;
  copyWidget: boolean;
  displayType: any;

  constructor(
    private widgetService: WidgetService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private viewService: ViewService
  ) {}

  /** set up edit component */
  ngOnInit(): void {
    const paramsSub = this.route.params.subscribe((params: Params) => {
      const widgetId = +params["widgetId"];
      const dashboardId = +params["dashboardId"];

      const snapshot = this.route.snapshot;
      this.metrics = snapshot.data["metrics"];

      // check if editing or creating
      this.widget =
        snapshot.data["widget"] ||
        new Widget({ dashboard: dashboardId, name: "" });

      this.editMode = !!widgetId;
      //check if copying to new dashboard
      this.copyWidget = this.widget.dashboardId !== dashboardId;
      if (this.copyWidget) {
        this.widget.id = null;
        this.widget.dashboardId = dashboardId;
      }
    });
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Emit resize event when tabs change */
  stepSelected(): void {
    window.dispatchEvent(new Event("resize"));
  }

  /** Saves widget */
  save(): void {
    this.widgetService.updateOrCreate(this.widget).subscribe({
      next: (widgetId: number) => {
        this.widget.id = widgetId;
        this.viewService.updateWidget(this.widget.id, this.widget);
        this.messageService.message("Widget saved.");
        this.cancel(this.widget);
      },
      error: () => {
        this.messageService.error("Could not save widget.");
      },
    });
  }

  /**
   * Cancel without saving widget
   *
   * @param widget widget getting edited
   */
  cancel(widget?: Widget): void {
    if (this.id) {
      this.router.navigate(["../../"], { relativeTo: this.route });
    } else {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
    // this.dialogRef.close(widget);
  }
}
