import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";

@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
})
export class WidgetEditInfoComponent implements OnInit {
  @Input() name: string;
  @Input() type: string;
  @Input() stat: string;
  @Input() properties: any;
  @Input() displayType: any;
  @Output() displayTypeChange = new EventEmitter<any>();
  @Output() propertiesChange = new EventEmitter<any>();
  @Output() nameChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() statChange = new EventEmitter<string>();

  selectedType: any;
  error: string;
  done = false;
  // TODO: Get this from SQUAC

  widgetTypes: any;
  statTypes: any;

  widgetForm = new FormGroup({
    name: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    stat: new FormControl("latest", Validators.required), // default is raw data
    displayType: new FormControl(""),
  });

  constructor(widgetConfigService: WidgetConfigService) {
    this.statTypes = widgetConfigService.statTypes;
    this.widgetTypes = widgetConfigService.widgetTypes;
  }

  ngOnInit(): void {
    this.widgetForm.get("displayType").valueChanges.subscribe((displayType) => {
      this.displayType = displayType;
      this.properties.displayType = this.displayType?.displayType;
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
    this.selectedType = this.widgetTypes.find((type) => {
      return type.type === this.type;
    });
    // default to 'mean'
    if (!this.stat) {
      this.stat = "mean";
    }
    // change displayOptions
    if (this.selectedType?.displayOptions) {
      this.displayType = this.selectedType.displayOptions?.find(
        (option) => option.displayType === this.properties.displayType
      );
      this.displayType =
        this.displayType || this.selectedType.displayOptions[0];
      this.properties.displayType = this.displayType.displayType;
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
