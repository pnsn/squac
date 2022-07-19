import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Form, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Channel } from "@core/models/channel";
import { startWith, map, Observable } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ViewService } from "@core/services/view.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";

@Component({
  selector: "dashboard-channel-filter",
  templateUrl: "./channel-filter.component.html",
  styleUrls: ["./channel-filter.component.scss"],
})
export class ChannelFilterComponent implements OnInit {
  filteredChannels: Observable<Channel[]>;
  @Input() channels: Channel[];
  form: FormGroup;
  timeout;
  constructor(
    private formBuilder: FormBuilder,
    private widgetConnectService: WidgetConnectService,
    private viewService: ViewService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      checkboxes: this.formBuilder.group({}),
    });

    const checkboxes = <FormGroup>this.form.get("checkboxes");
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
  mouseleave(item) {
    this.widgetConnectService.deemphasizeChannel.next(item);
  }

  update() {
    const value = <FormGroup>this.form.get("checkboxes").value;
    const channels = this.channels.filter((c) => value[c.nslc.toUpperCase()]);
    this.viewService.updateChannels(channels);
  }

  toggleAll(toggle) {
    const checkboxes = this.form.get("checkboxes") as FormGroup;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(toggle);
    });
  }
}
