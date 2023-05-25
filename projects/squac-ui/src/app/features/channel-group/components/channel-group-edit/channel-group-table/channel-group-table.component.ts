import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Channel } from "squacapi";
import {
  ColumnMode,
  SelectionType,
  SortType,
} from "@boring.devs/ngx-datatable";

/**
 * Table showing a list of channels
 */
@Component({
  selector: "channel-group-edit-table",
  templateUrl: "./channel-group-table.component.html",
  styleUrls: ["./channel-group-table.component.scss"],
})
export class ChannelGroupTableComponent implements OnInit {
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
  /** Template for remove option on table */
  @ViewChild("removeTemplate") removeTemplate: TemplateRef<any>;
  /** Template for header row of table */
  @ViewChild("headerTemplate") headerTemplate: TemplateRef<any>;

  /** Table config */
  /** ngxdatatable selection type */
  SelectionType = SelectionType;
  /** ngxdatatable column mode */
  ColumnMode = ColumnMode;
  /** ngxdatatable sort type */
  SortType = SortType;
  /** table columns */
  columns: any = [];
  /** display messages for table */
  messages = {
    emptyMessage: "No channels found.",
  };

  /**
   * Init table columns
   */
  ngOnInit(): void {
    // table columns
    setTimeout(() => {
      this.columns = [];

      if (this.selectable) {
        this.columns.push({
          width: 30,
          canAutoResize: false,
          sortable: false,
          draggable: false,
          resizeable: false,
          headerCheckboxable: true,
          checkboxable: true,
        });
      }

      this.columns = [
        ...this.columns,

        {
          name: "Network",
          prop: "net",
          draggable: false,
          sortable: true,
          resizeable: false,
          flexGrow: 1,
          headerTemplate: this.headerTemplate,
        },
        {
          name: "Station",
          prop: "sta",
          draggable: false,
          sortable: true,
          resizeable: false,
          flexGrow: 1,
          headerTemplate: this.headerTemplate,
        },
        {
          name: "Location",
          prop: "loc",
          draggable: false,
          sortable: true,
          resizeable: false,
          flexGrow: 1,
          headerTemplate: this.headerTemplate,
        },
        {
          name: "Channel",
          prop: "code",
          draggable: false,
          sortable: true,
          resizeable: false,
          flexGrow: 1,
          headerTemplate: this.headerTemplate,
        },
      ];
      // if (!this.selectable) {
      //   this.columns.push({
      //     name: "",
      //     prop: "",
      //     width: 30,
      //     canAutoResize: false,
      //     draggable: false,
      //     sortable: false,
      //     resizeable: false,
      //     flexGrow: 1,
      //     cellTemplate: this.removeTemplate,
      //   });
      // }
    }, 0);
  }
  /**
   * Select row in table
   *
   * @param $event selected row
   */
  selectRow($event): void {
    this.selected = [...$event.selected];
    this.selectedChange.emit(this.selected);
  }

  /**
   * Remove selected rows from rows
   */
  removeSelected(): void {
    this.rows = this.rows.filter(
      (channel: Channel) =>
        this.selected.findIndex((c: Channel) => c.id === channel.id) < 0
    );
    this.selectRow({ selected: [] });
    this.rowsChange.emit(this.rows);
  }

  /**
   * Remove row from rows
   *
   * @param row row to remove
   */
  removeRow(row: Channel): void {
    this.rows = this.rows.filter((channel) => {
      return channel.id !== row.id;
    });
    this.rowsChange.emit(this.rows);
  }
}
