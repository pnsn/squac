import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Channel } from "squacapi";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";

/**
 * Table showing a list of channels
 */
@Component({
  selector: "channel-group-edit-table",
  templateUrl: "./channel-group-table.component.html",
  styleUrls: ["./channel-group-table.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
  ],
})
export class ChannelGroupTableComponent implements OnInit, OnChanges {
  /** table rows */
  @Input() rows: Channel[] = [];
  /** selected row on table */
  @Input() selected: Channel[] = [];
  /** title for table  */
  @Input() title: string;
  /** true if rows should be selectable */
  @Input() selectable: boolean;
  /** true if rows should be removable */
  @Input() removable: boolean;
  /** Emits array of channels */
  @Output() rowsChange = new EventEmitter<Channel[]>();
  /** Emits selected channels */
  @Output() selectedChange = new EventEmitter<Channel[]>();

  /** Mat sort directive, used to enable sorting on */
  @ViewChild(MatSort) sort: MatSort;
  /** columns shown in table */
  channelColumns: string[] = ["net", "sta", "loc", "code"];
  /** alert table data source */
  dataSource: MatTableDataSource<Channel> = new MatTableDataSource([]);
  /** selection on alert table */
  selection: SelectionModel<Channel> = new SelectionModel(true, []);

  /**
   * @inheritdoc
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["rows"]) {
      this.dataSource.data = this.rows;
    }
    if (changes["selected"]) {
      this.selection.setSelection(...this.selected);
    }
  }

  /**
   *
   */
  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    // enable select column
    if (this.selectable) {
      this.channelColumns.unshift("select");
    }

    this.selection.changed.subscribe(() => {
      this.selectedChange.emit(this.selection.selected);
    });
  }

  /**
   * Remove selected rows from rows
   */
  removeSelected(): void {
    this.rows = this.rows.filter(
      (channel: Channel) => !this.selection.isSelected(channel)
    );
    this.selection.clear();
    this.rowsChange.emit(this.rows);
    this.selectedChange.emit(this.selection.selected);
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
}
