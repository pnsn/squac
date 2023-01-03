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

type CheckboxForm = Record<string, FormControl<boolean>>;

/**
 * Channel filter for dashboard
 */
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

  /**
   * Subscribe to group changes
   */
  ngOnInit(): void {
    this.channelsSub = this.viewService.channelGroupId
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.channels = this.viewService.allChannels;
        this.initForm();
      });
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.channelsSub.unsubscribe();
  }

  /**
   * Set up checkbox forms
   */
  initForm(): void {
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
      const value = <Record<string, boolean>>this.form.get("checkboxes").value;
      this.viewService.updateChannels(value);
    });
  }

  /**
   * Emits channel nslc when mouse enters a channel
   *
   * @param item channel nslc
   */
  mouseenter(item: string): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.widgetConnectService.emphasizedChannel.next(null);
      this.widgetConnectService.emphasizedChannel.next(item);
    }, 0);
  }

  /**
   * Emits empty when mouse leaves a channel
   *
   * @param _item channel nslc
   */
  mouseleave(_item: string): void {
    this.widgetConnectService.deemphasizeChannel.next(null);
  }

  /**
   * Collapses channel sidenav
   */
  toggleSidenav(): void {
    this.closeSidenav.emit(true);
  }

  /**
   * Toggle all channel checkboxes
   */
  toggleAll(): void {
    const checkboxes = this.form["controls"].checkboxes;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(!this.toggledAll);
    });
  }
}
