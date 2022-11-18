import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Channel } from "squacapi";
import { distinctUntilChanged, Observable, Subscription } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConnectService } from "widgets";

interface CheckboxForm {
  [x: string]: FormControl<boolean>;
}

@Component({
  selector: "dashboard-channel-filter",
  templateUrl: "./channel-filter.component.html",
  styleUrls: ["./channel-filter.component.scss"],
})
export class ChannelFilterComponent implements OnInit, OnDestroy {
  filteredChannels: Observable<Channel[]>;
  channels: Channel[] = [];
  form: FormGroup<{
    checkboxes: FormGroup<CheckboxForm>;
  }>;
  timeout;
  toggledAll = true;
  channelsSub: Subscription;
  @Output() closeSidenav = new EventEmitter<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private widgetConnectService: WidgetConnectService,
    private viewService: ViewService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.channelsSub = this.viewService.channelGroupId
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.channels = this.viewService.allChannels;
        this.initForm();
      });
  }

  ngOnDestroy(): void {
    this.channelsSub.unsubscribe();
  }

  initForm() {
    console.log("CHECK IF THIS STILL WORKS");
    if (!this.form) {
      this.form = this.formBuilder.group({
        checkboxes: new FormGroup<CheckboxForm>({}),
      });
    }

    this.form["controls"].checkboxes.reset();
    const checkboxes = this.form["controls"].checkboxes;

    this.channels.forEach((channel: Channel) => {
      checkboxes.addControl(channel.nslc, new FormControl<boolean>(true));
    });

    this.form.valueChanges.subscribe(() => {
      const value = <{ [x: string]: boolean }>this.form.get("checkboxes").value;
      this.viewService.updateChannels(value);
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
  toggleSidenav() {
    this.closeSidenav.emit(true);
  }

  toggleAll() {
    const checkboxes = this.form["controls"].checkboxes;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(!this.toggledAll);
    });
  }
}
