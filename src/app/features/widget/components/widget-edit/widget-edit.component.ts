import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { Widget } from "@widget/models/widget";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Metric } from "@core/models/metric";
import { ChannelGroup } from "@core/models/channel-group";
import { MessageService } from "@core/services/message.service";
import { WidgetService } from "@features/widget/services/widget.service";
import { ViewService } from "@core/services/view.service";

@Component({
  selector: "widget-edit",
  templateUrl: "./widget-edit.component.html",
  styleUrls: ["./widget-edit.component.scss"],
})
export class WidgetEditComponent implements OnDestroy, OnInit {
  id: number;
  widget: Widget;
  widgetType: string;
  subscriptions: Subscription = new Subscription();
  selectedMetrics: [];
  metrics: Metric[];
  channelGroups: ChannelGroup[];
  editMode: boolean;
  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetService,
    private messageService: MessageService,
    private viewService: ViewService
  ) {}

  ngOnInit() {
    this.editMode = !!this.data.widget;
    this.widget =
      this.data.widget ||
      new Widget(null, null, "", this.data.dashboardId, null, [], "", "");
    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Tables need to be resized when the tab appears
  stepSelected() {
    window.dispatchEvent(new Event("resize"));
  }

  save() {
    this.widget.channelGroupId = this.widget.channelGroup.id;
    this.widgetService.updateWidget(this.widget).subscribe({
      next: (response) => {
        this.widget.id = response.id;
        this.viewService.updateWidget(this.widget.id, this.widget);
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
