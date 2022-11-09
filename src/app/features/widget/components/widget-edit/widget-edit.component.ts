import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric } from "@squacapi/models/metric";
import { MessageService } from "@core/services/message.service";
import { ViewService } from "@core/services/view.service";
import { WidgetService } from "@squacapi/services/widget.service";
import { Widget } from "@squacapi/models/widget";
import { Subscription } from "rxjs";

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
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetService,
    private messageService: MessageService,
    private viewService: ViewService,
    widgetConfigService: WidgetConfigService
  ) {
    this.widgetTypes = widgetConfigService.widgetTypes;
  }

  ngOnInit(): void {
    // check if editing or creating
    this.editMode = !!this.data.widget;
    this.widget =
      this.data.widget ||
      new Widget(null, null, "", this.data.dashboardId, null, "", "");
    //check if copying to new dashboard
    this.copyWidget = this.widget.dashboardId !== this.data.dashboardId;
    if (this.copyWidget) {
      this.widget.id = null;
      this.widget.dashboardId = this.data.dashboardId;
    }
    this.metrics = this.data.metrics;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Tables need to be resized when the tab appears
  stepSelected(): void {
    window.dispatchEvent(new Event("resize"));
  }

  // save widget
  save(): void {
    this.widgetService.updateOrCreate(this.widget).subscribe({
      next: (response) => {
        this.widget.id = response.id;
        this.viewService.updateWidget(this.widget.id, this.widget);
        this.messageService.message("Widget saved.");
        this.cancel(response);
      },
      error: () => {
        this.messageService.error("Could not save widget.");
      },
    });
  }

  //TODO: make sure this isn't affecting existing widget
  cancel(widget?: Widget) {
    // this.widgetEditService.clearWidget();
    this.dialogRef.close(widget);
  }
}
