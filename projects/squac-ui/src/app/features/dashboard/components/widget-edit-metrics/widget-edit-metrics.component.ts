import { SelectionModel } from "@angular/cdk/collections";
import { NgIf } from "@angular/common";
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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
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
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    NgIf,
  ],
})
export class WidgetEditMetricsComponent implements OnInit, OnChanges {
  @Input() metrics: Metric[];
  @Input() selectedMetrics: Metric[];
  @Input() type: WidgetType;
  @Output() selectedMetricsChange = new EventEmitter<Metric[]>();

  minLength = 1;
  done = false;

  columns: any[] = [];

  /** Mat sort directive, used to enable sorting on */
  @ViewChild(MatSort) sort: MatSort;
  /** columns shown in table */
  metricColumns: string[] = ["select", "name", "unit", "description"];
  /** alert table data source */
  dataSource: MatTableDataSource<Metric> = new MatTableDataSource([]);
  /** selection on alert table */
  selection: SelectionModel<Metric> = new SelectionModel(true, []);

  /** init columns */
  ngOnInit(): void {
    this.dataSource.sort = this.sort;

    this.selection.changed.subscribe(() => {
      this.selectedMetricsChange.emit(this.selection.selected);
      this.checkValid();
    });
  }

  /**
   * listen to changed in widget config
   *
   * @param changes config changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["metrics"]) {
      this.dataSource.data = this.metrics;
    }
    if (changes["selectedMetrics"]) {
      this.selection.setSelection(...this.selectedMetrics);
    }

    // change min length when type changes
    if (changes["type"] && this.type) {
      const selectedType = WIDGET_TYPE_INFO[this.type].config;
      this.minLength = selectedType?.minMetrics || 1;
      this.checkValid();
    }
  }

  /**
   * Whether the number of selected elements matches the total number of rows
   *
   *  @returns true if all rows are selected
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /**
   * Checks there are the minimum number of metrics for widgets
   */
  checkValid(): void {
    this.done = this.selection.selected.length >= this.minLength;
  }

  //TODO: replace with shared filter component
  /**
   * Searches for metrics in table
   *
   * @param event html event
   */
  updateFilter(event): void {
    const val = event.target.value.toLowerCase();

    this.dataSource.filter = val;
    // filter our data
  }
}
