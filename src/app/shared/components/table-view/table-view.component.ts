import { Component, Input } from "@angular/core";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent {
  rowCount = 3;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  @Input() title: string;
  // @Output() refresh = new EventEmitter<boolean>();
  // @Input() parentOptions;
  // @Input() rows;
  // @Input() columns;

  selectedRows = [];

  //defaultOptions
  options = {
    columnMode: ColumnMode.force,
    selectionType: undefined,
    headerHeight: "30",
    footerHeight: "50",
    rowHeight: "auto",
    limit: undefined,
    reorderable: false,
    scrollbarH: false,
    scrollbarV: false,
    sortType: "single",
    sorts: [],
    messages: {
      emptyMessage: "No data",
      totalMessage: "total",
    },
  };
}
