import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from "@angular/forms";
import { Channel } from "@squacapi/models/channel";
import { distinctUntilChanged, Observable, Subscription } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConnectService } from "app/widgets/services/widget-connect.service";

@Component({
  selector: "dashboard-channel-filter",
  templateUrl: "./channel-filter.component.html",
  styleUrls: ["./channel-filter.component.scss"],
})
export class ChannelFilterComponent implements OnInit, OnDestroy {
  filteredChannels: Observable<Channel[]>;
  channels: Channel[] = [];
  form: UntypedFormGroup;
  timeout;
  toggledAll = true;
  channelsSub: Subscription;
  @Output() closeSidenav = new EventEmitter<boolean>();
  constructor(
    private formBuilder: UntypedFormBuilder,
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
    if (!this.form) {
      this.form = this.formBuilder.group({});
    }
    this.form.addControl("checkboxes", new UntypedFormGroup({}));

    const checkboxes = <UntypedFormGroup>this.form.get("checkboxes");
    checkboxes.controls = {};
    this.channels.forEach((option: any) => {
      checkboxes.addControl(option.nslc, new UntypedFormControl(true));
    });

    this.form.valueChanges.subscribe(() => {
      const value = <UntypedFormGroup>this.form.get("checkboxes").value;
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
    const checkboxes = this.form.get("checkboxes") as UntypedFormGroup;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(!this.toggledAll);
    });
  }
}
