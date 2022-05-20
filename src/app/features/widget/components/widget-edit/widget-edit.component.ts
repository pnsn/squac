import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  AfterContentInit,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Widget } from "@widget/models/widget";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
  widgetType: string;
  subscriptions: Subscription = new Subscription();
  selectedMetrics: [];
  metrics: Metric[];
  channelGroups: ChannelGroup[];
  editMode: boolean;

  isValid: boolean;
  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.widget = this.data.widget ? this.data.widget : null;
    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;
    console.log(this.widget.channelGroup);
    this.editMode = !!this.widget;
  }

  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
    this.isValid = true;
    // const sub = this.widgetEditService.isValid.subscribe(
    //   (valid) => {
    //     this.isValid = valid;
    //   },
    //   (error) => {
    //     console.log("error in widget edit valid: " + error);
    //   }
    // );
    // this.subscriptions.add(sub);
  }

  metricsChanged(event) {
    console.log("metrics", event);
  }

  channelGroupChanged(event) {
    console.log("channelGroups", event);
  }

  optionsChanged(event) {
    console.log("options", event);
  }

  infoChanged(event) {
    console.log("info", event);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Tables need to be resized when the tab appears
  stepSelected() {
    window.dispatchEvent(new Event("resize"));
  }

  save() {
    console.log(this.widget);
    // this.widgetEditService.saveWidget().subscribe(
    //   () => {
    //     this.cancel();
    //   },
    //   () => {
    //     this.messageService.error("Could not save widget.");
    //   }
    // );
  }

  //TODO: make sure this isn't affecting existing widget
  cancel(widget?: Widget) {
    // this.widgetEditService.clearWidget();
    this.dialogRef.close(widget);
  }
}
