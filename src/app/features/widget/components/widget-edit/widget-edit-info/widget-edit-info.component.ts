import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

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

  statTypes = [
    {
      id: 13,
      type: "latest",
      name: "Most recent",
      description: "",
    },
    {
      id: 2,
      type: "med",
      name: "Median",
      description: "",
    },
    {
      id: 3,
      type: "min",
      name: "Minimum",
      description: "",
    },
    {
      id: 4,
      type: "max",
      name: "Maximum",
      description: "",
    },
    {
      id: 7,
      type: "p95",
      name: "95th percentile",
      description: "",
    },
    {
      id: 8,
      type: "p90",
      name: "90th percentile",
      description: "",
    },
    {
      id: 10,
      type: "p10",
      name: "10th percentile",
      description: "",
    },
    {
      id: 16,
      type: "p05",
      name: "5th percentile",
      description: "",
    },
    {
      id: 1,
      type: "mean",
      name: "Average",
      description: "",
    },
    {
      id: 5,
      type: "numSamps",
      name: "Sample Count",
      description: "",
    },
    {
      id: 17,
      type: "minabs",
      name: "Min of abs(min, max)",
      description: "",
    },
    {
      id: 18,
      type: "maxabs",
      name: "Max of abs(min, max)",
      description: "",
    },
  ];
  selectedType;
  error: string;
  done = false;
  // TODO: Get this from SQUAC
  widgetTypes = [
    {
      id: 1,
      name: "table",
      type: "tabular",
      useAggregate: true,
      description:
        "Table showing channels (grouped as stations) and aggregated measurement values.",
    },
    {
      id: 2,
      name: "timeline",
      type: "timeline",
      useAggregate: false,
      description:
        "Measurements during time range for one metric, displayed as rows of channels",
    },
    {
      id: 3,
      name: "time series",
      type: "timeseries",
      useAggregate: false,
      description:
        "Measurements during time range for one metric, displayed as lines of channels",
    },
    {
      id: 4,
      name: "map",
      type: "map",
      useAggregate: true,
      description:
        "Map of channels (grouped as stations) represented by the measurement value or thresholds.",
    },
    // {
    //   id: 5,
    //   name: "box plot",
    //   type: "box-plot",
    //   use_aggregate: true,
    // },
    {
      id: 6,
      name: "parallel plot",
      type: "parallel-plot",
      useAggregate: true,
      description:
        "Aggregated measurements for multiple metrics, displayed as lines of channels on multiple axes.",
    },
    {
      id: 7,
      name: "scatter plot",
      type: "scatter-plot",
      useAggregate: true,
      description: "Measurements for 3 metrics displayed as a scatter plot.",
    },
  ];

  widgetForm = new FormGroup({
    name: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    stat: new FormControl(this.statTypes[0], Validators.required), // default is raw data
  });
  constructor() {}

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
