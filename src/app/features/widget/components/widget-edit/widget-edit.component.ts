import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { Widget } from "@widget/models/widget";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric } from "@core/models/metric";
import { MessageService } from "@core/services/message.service";
import { WidgetService } from "@features/widget/services/widget.service";
import { ViewService } from "@core/services/view.service";

@Component({
  selector: "widget-edit",
  templateUrl: "./widget-edit.component.html",
  styleUrls: ["./widget-edit.component.scss"],
})
export class WidgetEditComponent implements OnDestroy, OnInit {
  subscriptions: Subscription = new Subscription();

  id: number;
  widget: Widget;
  widgetType: string;

  selectedMetrics: [];
  metrics: Metric[];
  editMode: boolean;
  copyWidget: boolean;
  displayType: any;

  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetService,
    private messageService: MessageService,
    private viewService: ViewService
  ) {}

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
    this.widgetService.updateWidget(this.widget).subscribe({
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

  change(event) {
    console.log(event);
  }
  //TODO: make sure this isn't affecting existing widget
  cancel(widget?: Widget) {
    // this.widgetEditService.clearWidget();
    this.dialogRef.close(widget);
  }
}
