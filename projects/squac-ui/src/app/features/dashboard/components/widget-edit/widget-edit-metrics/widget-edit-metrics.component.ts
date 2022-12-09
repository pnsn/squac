import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  AfterContentChecked,
} from "@angular/core";
import { SelectionType, ColumnMode } from "@boring.devs/ngx-datatable";
import { Metric } from "squacapi";
import { WIDGET_TYPE_INFO } from "widgets";
import { WidgetType } from "widgets";

// TODO: make sortable/draggable
/**
 * Component for selecting metrics for widgets
 */
@Component({
  selector: "widget-edit-metrics",
  templateUrl: "./widget-edit-metrics.component.html",
  styleUrls: ["./widget-edit-metrics.component.scss"],
})
export class WidgetEditMetricsComponent
  implements OnInit, OnChanges, AfterContentChecked
{
  @Input() metrics: Metric[];
  @Input() selectedMetrics: Metric[];
  @Input() type: WidgetType;
  @Output() selectedMetricsChange = new EventEmitter<Metric[]>();

  minLength = 1;
  done = false;

  @ViewChild("metricTable") metricTable;
  // table config
  selected: Metric[] = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  rows: Metric[] = [];
  columns: any[] = [];

  /** init columns */
  ngOnInit(): void {
    this.columns = [
      {
        width: 30,
        canAutoResize: false,
        sortable: false,
        draggable: false,
        resizeable: false,
        headerCheckboxable: true,
        checkboxable: true,
      },
      {
        name: "Name",
        flexGrow: 2,
      },
      {
        name: "Unit",
        width: 50,
        canAutoResize: false,
        resizeable: true,
      },
      {
        name: "Description",
        flexGrow: 4,
      },
    ];
  }

  /** after ciontent checked, update selected metrics */
  ngAfterContentChecked(): void {
    if (this.selectedMetrics) {
      const temp = this.metrics.filter((metric) => {
        return this.selectedMetrics.findIndex((m) => m.id === metric.id) > -1;
      });
      this.selected = [...temp];
      this.checkValid();
    }
  }

  /**
   * listen to changed in widget config
   *
   * @param changes config changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    //update metrics
    if (this.columns && changes["metrics"] && changes["metrics"].currentValue) {
      this.rows = [...this.metrics];
    }

    // change min length when type changes
    if (changes["type"] && this.type) {
      const selectedType = WIDGET_TYPE_INFO[this.type].config;
      this.minLength = selectedType?.minMetrics || 1;
      this.checkValid();
    }
  }

  /**
   * emit metrics when changed
   *
   * @param event selection
   * @param event.selected selected metrics
   */
  metricsSelected({ selected }): void {
    this.selected = [...selected];
    this.selectedMetricsChange.emit(selected);
    this.checkValid();
  }

  /**
   * Checks there are the minimum number of metrics for widgets
   */
  checkValid(): void {
    this.done =
      this.selectedMetrics && this.selectedMetrics.length >= this.minLength;
  }

  //TODO: replace with shared filter component
  /**
   * Searches for metrics in table
   *
   * @param event html event
   */
  updateFilter(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.metrics.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = [...temp];
  }
}
