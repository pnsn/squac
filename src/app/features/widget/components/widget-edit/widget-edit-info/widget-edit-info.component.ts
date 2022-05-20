import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";

@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
})
export class WidgetEditInfoComponent implements OnChanges {
  @Input() name: string;
  @Input() type: string;
  @Input() stat: string;

  @Output() nameChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() statChange = new EventEmitter<string>();

  selectedType;
  error: string;
  done = false;
  // TODO: Get this from SQUAC

  widgetForm: FormGroup;
  widgetTypes;
  statTypes;

  constructor(private widgetConfigService: WidgetConfigService) {
    this.statTypes = this.widgetConfigService.statTypes;
    this.widgetTypes = this.widgetConfigService.widgetTypes;
    this.widgetForm = new FormGroup({
      name: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      stat: new FormControl(this.statTypes[0], Validators.required), // default is raw data
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.name && changes.name.currentValue) {
      this.patchForm({ name: this.name });
    }
    if (changes.type && changes.type.currentValue) {
      this.selectedType = this.widgetTypes.find((type) => {
        return type.type === this.type;
      });
      this.patchForm({ type: this.type });
    }
    if (changes.stat && changes.stat.currentValue) {
      this.patchForm({ stat: this.stat });
    }
  }

  patchForm(value) {
    this.widgetForm.patchValue(value);
    this.checkValid();
  }

  updateName() {
    this.name = this.widgetForm.value.name;
    this.nameChange.emit(this.name);
  }

  updateStat() {
    this.stat = this.widgetForm.value.stat;
    this.statChange.emit(this.stat);
  }

  updateType() {
    this.type = this.widgetForm.value.type;
    this.typeChange.emit(this.type);
  }

  checkValid() {
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
