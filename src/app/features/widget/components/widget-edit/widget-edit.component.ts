import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  AfterContentInit,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Widget } from "@features/widget/models/widget";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WidgetEditService } from "../../services/widget-edit.service";
import { Metric } from "@core/models/metric";
import { ChannelGroup } from "@core/models/channel-group";
import { MessageService } from "@core/services/message.service";

@Component({
  selector: "widget-edit",
  templateUrl: "./widget-edit.component.html",
  styleUrls: ["./widget-edit.component.scss"],
})
export class WidgetEditComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  id: number;
  widget: Widget;

  subscriptions: Subscription = new Subscription();

  metrics: Metric[];
  channelGroups: ChannelGroup[];
  statTypes;
  editMode: boolean;

  isValid: boolean;
  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetEditService: WidgetEditService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.widget = this.data.widget ? this.data.widget : null;
    this.statTypes = this.data.statTypes;
    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;

    this.editMode = !!this.widget;
    this.widgetEditService.setWidget(this.widget, +this.data.dashboardId);
  }

  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
    const sub = this.widgetEditService.isValid.subscribe(
      (valid) => {
        this.isValid = valid;
      },
      (error) => {
        console.log("error in widget edit valid: " + error);
      }
    );
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Tables need to be resized when the tab appears
  stepSelected() {
    window.dispatchEvent(new Event("resize"));
  }

  save() {
    this.widgetEditService.saveWidget().subscribe(
      () => {
        this.cancel();
      },
      () => {
        this.messageService.error("Could not save widget.");
      }
    );
  }

  cancel(widget?: Widget) {
    this.widgetEditService.clearWidget();
    this.dialogRef.close(widget);
  }
}