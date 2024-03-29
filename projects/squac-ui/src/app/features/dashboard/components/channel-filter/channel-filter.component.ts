import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Channel } from "squacapi";
import { distinctUntilChanged, Observable, Subscription } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConnectService } from "widgets";
import { LoadingService } from "@core/services/loading.service";
import { LoadingIndicator } from "../../pages/detail/dashboard-detail.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { AsyncPipe, KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

type CheckboxForm = Record<string, FormControl<boolean>>;

/**
 * Channel filter for dashboard
 */
@Component({
  selector: "dashboard-channel-filter",
  templateUrl: "./channel-filter.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCheckboxModule,
    LoadingDirective,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    KeyValuePipe,
    AsyncPipe,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ChannelFilterComponent implements OnInit, OnDestroy {
  filteredChannels: Observable<Channel[]>;
  channels: Channel[] = [];
  form: FormGroup<{
    checkboxes: FormGroup<CheckboxForm>;
  }>;
  toggledAll = true;
  channelsSub: Subscription;
  groupsSub: Subscription;
  LoadingIndicator = LoadingIndicator;
  @Output() closeSidenav = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private widgetConnectService: WidgetConnectService,
    private viewService: ViewService,
    private cdr: ChangeDetectorRef,
    protected loadingService: LoadingService
  ) {}

  /**
   * Subscribe to group changes
   */
  ngOnInit(): void {
    this.groupsSub = this.viewService.channelGroupId
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.channels = this.viewService.allChannels;
        this.initForm();
      });

    this.channelsSub = this.viewService.channelsChanged.subscribe(
      (channels) => {
        this.channels = channels;
        this.initForm();
      }
    );
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.channelsSub.unsubscribe();
    this.groupsSub.unsubscribe();
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

    this.form["controls"].checkboxes = new FormGroup<CheckboxForm>({});
    const checkboxes = this.form["controls"].checkboxes;

    this.channels.forEach((channel: Channel) => {
      checkboxes.addControl(channel.nslc, new FormControl<boolean>(true));
    });

    this.form["controls"].checkboxes.valueChanges.subscribe(
      (value: Record<string, boolean>) => {
        this.viewService.updateChannels(value);
      }
    );
    this.cdr.detectChanges();
  }

  /**
   * Emits channel nslc when mouse enters a channel
   *
   * @param item channel nslc
   */
  mouseenter(item): void {
    this.widgetConnectService.emphasizedChannel.next(item);
  }

  /**
   * Emits empty when mouse leaves a channel
   *
   * @param _item channel nslc
   */
  mouseleave(_item: string): void {
    // this.widgetConnectService.deemphasizeChannel.next(null);
  }

  /**
   * Collapses channel sidenav
   */
  toggleSidenav(): void {
    this.closeSidenav.emit(true);
  }

  /**
   * Trackby function for ngFor
   *
   * @param index item index
   * @param el nf for element
   * @returns string key of item
   */
  trackByMethod(index: number, el: any): string {
    return el.key;
  }

  /**
   * Toggle all channel checkboxes
   */
  toggleAll(): void {
    const checkboxes = this.form["controls"].checkboxes;
    Object.keys(checkboxes.controls).forEach((key) => {
      checkboxes.controls[key].patchValue(this.toggledAll);
    });
    this.cdr.detectChanges();
  }
}
