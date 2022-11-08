import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import {
  WidgetTypeInfo,
  WidgetTypes,
} from "@features/widget/interfaces/widget-types";
import { WidgetProperties } from "@squacapi/models/widget";
import { WidgetType } from "@features/widget/interfaces/widget-type";
import {
  WidgetStatTypeNames,
  WidgetStatTypes,
} from "@features/widget/interfaces/widget-stattypes";

@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
})
export class WidgetEditInfoComponent implements OnInit {
  @Input() name: string;
  @Input() type: WidgetTypes;
  @Input() stat: WidgetStatTypes;
  @Input() properties: WidgetProperties;
  @Input() displayType: string;
  @Output() displayTypeChange = new EventEmitter<string>();
  @Output() propertiesChange = new EventEmitter<WidgetProperties>();
  @Output() nameChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<WidgetTypes>();
  @Output() statChange = new EventEmitter<WidgetStatTypes>();

  WidgetTypes = WidgetTypes;
  WidgetTypeInfo = WidgetTypeInfo;
  WidgetStatTypes = WidgetStatTypes;
  WidgetStatTypeNames = WidgetStatTypeNames;
  selectedType: WidgetType;
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
      this.changeTypes();
      this.typeChange.emit(this.type);
      this.checkValid();
    });
    this.initForm();
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
    this.selectedType = WidgetTypeInfo[this.type].config;
    // default to 'mean'
    if (!this.stat) {
      this.stat = WidgetStatTypes.MEAN;
    }

    // change displayOptions
    if (this.selectedType?.displayOptions) {
      if (!this.properties.displayType) {
        this.properties.displayType = this.selectedType.defaultDisplay;
      } else if (
        !this.selectedType.displayOptions[this.properties.displayType]
      ) {
        this.properties.displayType = this.selectedType.defaultDisplay;
      }

      this.displayType =
        this.properties.displayType || this.selectedType.defaultDisplay;
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
