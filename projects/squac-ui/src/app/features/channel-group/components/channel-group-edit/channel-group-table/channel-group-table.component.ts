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

@Component({
  selector: "channel-group-edit-table",
  templateUrl: "./channel-group-table.component.html",
  styleUrls: ["./channel-group-table.component.scss"],
})
export class ChannelGroupTableComponent implements OnInit {
  @Input() rows: Channel[] = [];
  @Input() selected: Channel[] = [];
  @Input() title: string;
  @Input() selectable: boolean;
  @Output() rowsChange = new EventEmitter<Channel[]>();
  @Output() selectedChange = new EventEmitter<Channel[]>();
  @ViewChild("removeTemplate") removeTemplate: TemplateRef<any>;
  @ViewChild("headerTemplate") headerTemplate: TemplateRef<any>;
  // table config
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  SortType = SortType;
  columns: any = [];
  messages = {
    emptyMessage: "No channels found.",
  };

  ngOnInit(): void {
    // table columns
    setTimeout(() => {
      this.columns = [];

      this.columns.push({
        width: 30,
        canAutoResize: false,
        sortable: false,
        draggable: false,
        resizeable: false,
        headerCheckboxable: true,
        checkboxable: true,
      });

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
  selectRow($event): void {
    this.selected = [...$event.selected];
    this.selectedChange.emit(this.selected);
  }

  removeSelected(): void {
    this.rows = this.rows.filter(
      (channel: Channel) =>
        this.selected.findIndex((c: Channel) => c.id === channel.id) < 0
    );
    this.selectRow({ selected: [] });
    this.rowsChange.emit(this.rows);
  }

  removeRow(row): void {
    this.rows = this.rows.filter((channel) => {
      return channel.id !== row.id;
    });
    this.rowsChange.emit(this.rows);
  }
}