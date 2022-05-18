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
  @Input() statTypes;
  editMode: boolean;
  widgetForm: FormGroup;

  id;
  selectedType;
  error = "Missing widget name";
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
      statType: new FormControl(13, Validators.required), // default is raw data
    });
    this.initForm();
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.checkValid();
  }

  getWidgetTypeById(id) {
    return this.widgetTypes.find((type) => type.id === id);
  }
  private initForm() {
    if (this.editMode) {
      this.id = this.widget.id;
      this.widgetForm.patchValue({
        name: this.widget.name,
        statType: this.widget.properties.stat,
      });
      this.selectedType = this.widget.type;
    }
  }

  selectType(type) {
    this.selectedType = type;
    this.widgetEditService.updateType(type);
    this.checkValid();
  }

  checkValid() {
    this.done =
      !!this.widgetForm && this.widgetForm.valid && !!this.selectedType;
    if (!this.done) {
      if (this.widgetForm && !this.widgetForm.valid) {
        this.error = "Missing widget name";
      } else if (!this.selectedType) {
        this.error = "Missing widget type";
      } else {
        this.error = "Missing widget info";
      }
    }
  }

  updateInfo() {
    const values = this.widgetForm.value;
    this.widgetEditService.updateWidgetInfo(
      values.name,
      values.type,
      values.statType
    );
  }
}
