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
      name: "tabular",
      type: "tabular",
      useAggregate: true,
      description:
        "Table of measurement values displayed with a single value calculated with the stat type.",
    },
    {
      id: 2,
      name: "timeline",
      type: "timeline",
      useAggregate: false,
      description:
        "Timeline of measurement data for a single metric displayed with values 'in' or 'out' of set threshold values.",
    },
    {
      id: 3,
      name: "time series",
      type: "timeseries",
      useAggregate: false,
      description: "Time chart of measurement values for a single metric.",
    },
    {
      id: 4,
      name: "Map",
      type: "map",
      useAggregate: true,
      description:
        "A map of channels represented by values for measurements calculated with stattype.",
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
        statType: this.widget.stattype.id,
      });
      this.selectedType = this.widget.typeId;
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
    const statType = this.statTypes.find((st) => {
      return st.id === values.statType;
    });
    this.widgetEditService.updateWidgetInfo(values.name, "", statType);
  }
}
