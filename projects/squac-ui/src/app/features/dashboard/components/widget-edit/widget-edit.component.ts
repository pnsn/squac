import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric } from "squacapi";
import { MessageService } from "@core/services/message.service";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetService } from "squacapi";
import { Widget } from "widgets";
import { Subscription } from "rxjs";

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
    private messageService: MessageService,
    private viewService: ViewService,
    public dialogRef?: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  /** set up edit component */
  ngOnInit(): void {
    // check if editing or creating
    this.editMode = !!this.data["widget"];
    const dashboardId = this.data["dashboardId"];
    this.widget =
      this.data.widget || new Widget({ dashboard: dashboardId, name: "" });

    //check if copying to new dashboard
    this.copyWidget = this.widget.dashboardId !== dashboardId;
    if (this.copyWidget) {
      this.widget.id = null;
      this.widget.dashboardId = dashboardId;
    }
    this.metrics = this.data["metrics"];
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
      next: (response) => {
        const widget = response as Widget;
        this.widget.id = response.id;
        this.viewService.updateWidget(this.widget.id, this.widget);
        this.messageService.message("Widget saved.");
        this.cancel(widget);
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
    this.dialogRef.close(widget);
  }
}
