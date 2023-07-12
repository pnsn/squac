import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WIDGET_TYPE_INFO, WIDGET_STAT_TYPE_NAMES } from "widgets";
import { WidgetConfig } from "widgets";
import { WidgetType } from "widgets";
import { WidgetProperties, WidgetStatType } from "squacapi";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { KeyValuePipe, NgForOf, NgIf } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { WidgetTypeExampleDirective } from "../widget-type-example/widget-type-example.directive";

/** Widget information edit form */
interface WidgetForm {
  /** widget name */
  name: FormControl<string>;
  /** type of widget */
  type: FormControl<WidgetType>;
  /** statistic for measurements */
  stat: FormControl<WidgetStatType>;
  /** display type for widget type */
  displayType: FormControl<string>;
}
/**
 * Component for editing widget info
 */
@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    KeyValuePipe,
    NgIf,
    NgForOf,
    WidgetTypeExampleDirective,
  ],
})
export class WidgetEditInfoComponent implements OnInit {
  /** widget name */
  @Input() name: string;
  /** widget type */
  @Input() type: WidgetType;
  /** widget stat type */
  @Input() stat: WidgetStatType;
  /** widget properties */
  @Input() properties: WidgetProperties;
  /** widget display type */
  @Input() displayType: string;
  @Output() displayTypeChange = new EventEmitter<string>();
  @Output() propertiesChange = new EventEmitter<WidgetProperties>();
  @Output() nameChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<WidgetType>();
  @Output() statChange = new EventEmitter<WidgetStatType>();

  previewType: WidgetType;
  WidgetType = WidgetType;
  WidgetTypeInfo = WIDGET_TYPE_INFO;
  WidgetStatType = WidgetStatType;
  WIDGET_STAT_TYPE_NAMES = WIDGET_STAT_TYPE_NAMES;
  widgetConfig: WidgetConfig;
  error: string;
  done = false;
  // TODO: Get this from SQUAC

  statTypes: any;

  widgetForm = new FormGroup<WidgetForm>({
    name: new FormControl<string>("", Validators.required),
    type: new FormControl<WidgetType>(null, Validators.required),
    stat: new FormControl<WidgetStatType>("latest", Validators.required), // default is raw data
    displayType: new FormControl<string>(""),
  });

  /** init widget form change subscriptions */
  ngOnInit(): void {
    this.widgetForm.get("displayType").valueChanges.subscribe((displayType) => {
      this.displayType = displayType;
      this.properties.displayType = this.displayType;
      this.displayTypeChange.emit(this.displayType);
      this.propertiesChange.emit(this.properties);
    });

    this.widgetForm.get("name").valueChanges.subscribe((name) => {
      this.name = name;
      this.nameChange.emit(this.name);
      this.checkValid();
    });
    this.widgetForm.get("stat").valueChanges.subscribe((stat) => {
      this.stat = stat;
      this.statChange.emit(this.stat);
      this.checkValid();
    });
    this.widgetForm.get("type").valueChanges.subscribe((type) => {
      this.type = type;
      if (this.previewType !== type) {
        this.previewType = type;
      }

      this.changeTypes();
      this.typeChange.emit(this.type);
      this.checkValid();
    });
    this.initForm();
  }

  /**
   * Change widget type
   */
  updateType(): void {
    if (this.type !== this.previewType) {
      this.type === this.previewType;
      this.widgetForm.patchValue(
        {
          type: this.previewType,
        },
        { emitEvent: true }
      );
    }
  }

  /**
   * Set up form
   */
  initForm(): void {
    this.widgetForm.patchValue(
      {
        name: this.name,
        type: this.type,
      },
      { emitEvent: true }
    );
  }

  /**
   * When type of widget changes, updates related options
   */
  changeTypes(): void {
    if (this.type) {
      this.widgetConfig = this.WidgetTypeInfo[this.type].config;
      // default to 'mean'
      if (!this.stat) {
        this.stat = "mean";
      }

      // change displayOptions
      if (this.widgetConfig?.displayOptions) {
        if (!this.properties.displayType) {
          this.properties.displayType = this.widgetConfig.defaultDisplay;
        } else if (
          !this.widgetConfig.displayOptions[this.properties.displayType]
        ) {
          this.properties.displayType = this.widgetConfig.defaultDisplay;
        }

        this.displayType =
          this.properties.displayType || this.widgetConfig.defaultDisplay;
      } else {
        this.displayType = null;
        this.properties.displayType = null;
      }
      this.widgetForm.patchValue(
        {
          stat: this.stat,
          displayType: this.displayType,
        },
        { emitEvent: true }
      );
    }
  }

  /**
   * Change preview type for widget display
   *
   * @param e event
   */
  changePreviewType(e?: WidgetType): void {
    if (!e) {
      this.previewType = this.type || this.previewType;
    } else {
      this.previewType = e;
    }
  }

  /**
   * Checks widget has all properties
   */
  checkValid(): void {
    this.done = !!this.name && !!this.type && !!this.stat;
    if (!this.done) {
      if (!this.name) {
        this.error = "Missing widget name";
      } else if (!this.type) {
        this.error = "Missing widget type";
      } else {
        this.error = "Missing widget info";
      }
    }
  }
}
