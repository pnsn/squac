import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Metric } from "squacapi";
import { MessageService } from "@core/services/message.service";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetService } from "squacapi";
import { Widget } from "widgets";
import { Subscription } from "rxjs";
import { WidgetEditInfoComponent } from "../widget-edit-info/widget-edit-info.component";
import { WidgetEditMetricsComponent } from "../widget-edit-metrics/widget-edit-metrics.component";
import { WidgetEditOptionsComponent } from "../widget-edit-options/widget-edit-options.component";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";

/**
 * Widget edit main component
 */
@Component({
  selector: "widget-edit",
  templateUrl: "./widget-edit.component.html",
  standalone: true,
  imports: [
    WidgetEditInfoComponent,
    WidgetEditMetricsComponent,
    WidgetEditOptionsComponent,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    NgIf,
  ],
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
      this.data.widget ||
      new Widget({ dashboard: dashboardId, name: "", metrics: [] });

    //check if copying to new dashboard
    this.copyWidget = this.widget.dashboardId !== dashboardId;
    if (this.copyWidget) {
      this.widget.id = null;
      this.widget.dashboardId = dashboardId;
    }
    this.metrics = this.data["metrics"];

    if (this.editMode) {
      // select widget metrics from metrics list, so they are same object
      const temp = this.metrics.filter((metric) =>
        this.widget.metricsIds.includes(metric.id)
      );
      this.widget.metrics = temp;
    }
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
    this.dialogRef.close(widget);
  }
}
