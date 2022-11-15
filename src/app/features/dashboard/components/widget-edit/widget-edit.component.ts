import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric } from "@squacapi/models/metric";
import { MessageService } from "@core/services/message.service";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetService } from "@squacapi/services/widget.service";
import { Widget } from "@squacapi/models/widget";
import { Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";

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
    private route: ActivatedRoute,
    public dialogRef?: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    const paramsSub = this.route.params.subscribe((params: Params) => {
      const dashboardId = +params.dashboardId;
      const snapshot = this.route.snapshot;
      const data = snapshot.data;

      // check if editing or creating
      this.editMode = !!data.widget;
      this.widget =
        data.widget || new Widget(null, null, "", dashboardId, null, "", "");
      //check if copying to new dashboard
      this.copyWidget = this.widget.dashboardId !== dashboardId;
      if (this.copyWidget) {
        this.widget.id = null;
        this.widget.dashboardId = data.dashboardId;
      }
      this.metrics = data.metrics;
    });
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
    // this.dialogRef.close(widget);
  }
}
