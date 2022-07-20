import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
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
  changed: false;
  constructor(
    private formBuilder: FormBuilder,
    private widgetConnectService: WidgetConnectService,
    private viewService: ViewService
  ) {}

  ngOnInit() {}

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
  mouseleave(item) {
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
