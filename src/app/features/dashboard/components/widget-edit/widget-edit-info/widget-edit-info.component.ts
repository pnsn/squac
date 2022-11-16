import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import {
  WidgetType,
  WIDGET_TYPE_INFO,
} from "app/widgets/interfaces/widget-types";
import { WidgetProperties } from "@squacapi/models/widget";
import { WidgetConfig } from "app/widgets/interfaces/widget-type";
import {
  WIDGET_STAT_TYPE_NAMES,
  WidgetStatType,
} from "app/widgets/interfaces/widget-stattypes";

@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
})
export class WidgetEditInfoComponent implements OnInit {
  @Input() name: string;
  @Input() type: WidgetType;
  @Input() stat: WidgetStatType;
  @Input() properties: WidgetProperties;
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

  widgetForm = new UntypedFormGroup({
    name: new FormControl<string>("", Validators.required),
    type: new UntypedFormControl("", Validators.required),
    stat: new UntypedFormControl("latest", Validators.required), // default is raw data
    displayType: new FormControl<string>(""),
  });

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

  updateType() {
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
  // set up form
  initForm(): void {
    this.widgetForm.patchValue(
      {
        name: this.name,
        type: this.type,
      },
      { emitEvent: true }
    );
  }

  // when the type of widget changes, update related options
  changeTypes(): void {
    if (this.type) {
      this.widgetConfig = this.WidgetTypeInfo[this.type].config;
      // default to 'mean'
      if (!this.stat) {
        this.stat = WidgetStatType.MEAN;
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

  changePreviewType(e?) {
    if (!e) {
      this.previewType = this.type || this.previewType;
    } else {
      this.previewType = e;
    }
  }

  // check if has all properties
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
