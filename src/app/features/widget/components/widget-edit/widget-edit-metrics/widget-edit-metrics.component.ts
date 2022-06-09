import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { SelectionType, ColumnMode } from "@swimlane/ngx-datatable";
import { Metric } from "@core/models/metric";
@Component({
  selector: "widget-edit-metrics",
  templateUrl: "./widget-edit-metrics.component.html",
  styleUrls: ["./widget-edit-metrics.component.scss"],
})
export class WidgetEditMetricsComponent implements OnInit, OnChanges {
  @Input() metrics: Metric[];
  @Input() selectedMetrics: Metric[];

  @Output() selectedMetricsChange = new EventEmitter<Metric[]>();

  done = false;

  //table
  @ViewChild("metricTable") metricTable;
  selected: Metric[] = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  rows: Metric[] = [];
  columns = [];

  ngOnInit() {
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

  ngOnChanges(changes: SimpleChanges): void {
    //update metrics
    if (changes.metrics && changes.metrics.currentValue) {
      this.rows = [...this.metrics];
    }

    //update selected metrics
    if (changes.selectedMetrics && changes.selectedMetrics.currentValue) {
      const temp = this.metrics.filter((metric) => {
        return this.selectedMetrics.findIndex((m) => m.id === metric.id) > -1;
      });
      this.selected = [...temp];
      this.checkValid();
    }
  }

  metricsSelected({ selected }) {
    this.selectedMetricsChange.emit(selected);
  }

  checkValid() {
    this.done = this.selectedMetrics && this.selectedMetrics.length > 0;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.metrics.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = [...temp];
  }
}
