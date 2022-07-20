import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Channel } from "@core/models/channel";
import { Observable } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";

@Component({
  selector: "dashboard-channel-filter",
  templateUrl: "./channel-filter.component.html",
  styleUrls: ["./channel-filter.component.scss"],
})
export class ChannelFilterComponent implements OnChanges {
  filteredChannels: Observable<Channel[]>;
  @Input() channels: Channel[];
  form: FormGroup;
  timeout;
  changed: false;
  constructor(
    private formBuilder: FormBuilder,
    private widgetConnectService: WidgetConnectService,
    private viewService: ViewService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.channels) {
      this.initForm();
    }
  }

  initForm() {
    if (!this.form) {
      this.form = this.formBuilder.group({});
    }
    this.form.addControl("checkboxes", new FormGroup({}));

    const checkboxes = <FormGroup>this.form.get("checkboxes");
    checkboxes.controls = {};
    this.channels.forEach((option: any) => {
      checkboxes.addControl(option.nslc.toUpperCase(), new FormControl(true));
    });
  }

  mouseenter(item) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.widgetConnectService.emphasizedChannel.next(null);
      this.widgetConnectService.emphasizedChannel.next(item);
    }, 0);
  }
  mouseleave(_item) {
    this.widgetConnectService.deemphasizeChannel.next(null);
  }

  update() {
    const value = <FormGroup>this.form.get("checkboxes").value;
    const channels = this.channels.filter((c) => value[c.nslc.toUpperCase()]);
    this.viewService.updateChannels(channels);
    this.changed = false;
  }

  toggleAll(toggle) {
    const checkboxes = this.form.get("checkboxes") as FormGroup;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(toggle);
    });
  }
}
