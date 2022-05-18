import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Widget } from "@widget/models/widget";
import { WidgetEditService } from "@widget/services/widget-edit.service";

@Component({
  selector: "widget-edit-info",
  templateUrl: "./widget-edit-info.component.html",
  styleUrls: ["./widget-edit-info.component.scss"],
})
export class WidgetEditInfoComponent implements OnInit, AfterViewInit {
  @Input() widget: Widget;
  editMode: boolean;
  widgetForm: FormGroup;
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
  id: number;
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

  constructor(private widgetEditService: WidgetEditService) {}

  ngOnInit(): void {
    this.editMode = !!this.widget;

    this.widgetForm = new FormGroup({
      name: new FormControl("", Validators.required),
      stat: new FormControl(this.statTypes[0], Validators.required), // default is raw data
    });
    this.initForm();
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.checkValid();
  }

  getWidgetType(wType) {
    return this.widgetTypes.find((type) => type.type === wType);
  }
  private initForm() {
    if (this.editMode) {
      this.id = this.widget.id;
      this.widgetForm.patchValue({
        name: this.widget.name,
        stat: this.widget.properties.stat || this.statTypes[0],
      });
      this.selectedType = this.getWidgetType(this.widget.type);
    }
  }

  selectType(type) {
    this.selectedType = type;
    if (!this.selectedType.useAggregate) {
      this.widgetForm.patchValue({
        stat: this.statTypes[0],
      });
    }
    this.updateInfo();
  }

  checkValid() {
    const values = this.widgetForm.value;
    this.done = values.name && this.selectedType && values.stat;
    if (!this.done) {
      if (this.widgetForm && !values.name) {
        this.error = "Missing widget name";
      } else if (!this.selectedType) {
        this.error = "Missing widget type";
      } else {
        this.error = "Missing widget info";
      }
    }
  }

  updateInfo() {
    this.checkValid();
    const values = this.widgetForm.value;
    this.widgetEditService.updateWidgetInfo(
      values.name,
      this.selectedType.type,
      values.stat
    );
  }
}
