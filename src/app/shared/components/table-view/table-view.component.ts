import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
@Component({
  selector: "shared-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit {
  rowCount = 3;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  @Input() title: string;
  // @Output() refresh = new EventEmitter<boolean>();
  @Input() options;
  @Input() rows;
  @Input() columns;
  @Output() itemSelected = new EventEmitter<string>();
  @ViewChild("table") table;
  selectedRows = [];
  userPipe;
  orgPipe;
  tableRows;
  tableColumns;
  searchString;
  hideShared;
  constructor(
    private userService: UserService,
    private orgService: OrganizationService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }
  //defaultOptions
  tableOptions = {
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

  ngOnInit() {
    Object.keys(this.options).forEach((key) => {
      if (this.options[key]) {
        this.tableOptions[key] = this.options[key];
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(changes);
    if (changes.columns && changes.columns.currentValue) {
      this.processColumns();
    }
    if (changes.rows && changes.rows.currentValue) {
      console.log("row changes");
      this.tableRows = [...this.rows];
    }
  }

  processColumns() {
    this.columns.forEach((col, i) => {
      if (col.prop === "owner" || col.name === "Owner") {
        col.pipe = this.userPipe;
        col.comparator = this.userComparator.bind(this);
      }
      if (col.prop === "orgId" || col.name === "Organization") {
        col.pipe = this.orgPipe;
        col.comparator = this.orgComparator.bind(this);
      }
    });
    this.tableColumns = [...this.columns];
  }

  onSelect(event) {
    console.log(event);
    this.itemSelected.next("selected");
  }

  onDetailToggle(event) {
    console.log(event);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    if (val) {
      this.hideShared = false;
      // filter our data
      const temp = this.rows.filter((row) => {
        const test =
          row.name.toLowerCase().indexOf(val) !== -1 ||
          row.description.toLowerCase().indexOf(val) !== -1 ||
          this.userPipe.transform(row.owner).toLowerCase().indexOf(val) !==
            -1 ||
          this.userPipe.transform(row.orgId).toLowerCase().indexOf(val) !== -1;

        return test;
      });
      this.tableRows = temp;
    }
    // this.table.offset = 0;
  }

  removeFilter() {
    // this.rows = [...this.dashboards];
    // this.searchString = "";
  }

  toggleSharing({ checked }) {
    // if (checked) {
    //   const temp = this.dashboards.filter((d) => {
    //     return this.userId === d.owner;
    //   });
    //   this.rows = temp;
    // } else {
    //   this.rows = [...this.dashboards];
    // }
    // this.hideShared = checked;
  }

  userComparator(userIdA, userIdB) {
    const userNameA = this.userPipe.transform(userIdA).toLowerCase();
    const userNameB = this.userPipe.transform(userIdB).toLowerCase();

    if (userNameA < userNameB) {
      return -1;
    }
    if (userNameA > userNameB) {
      return 1;
    }
  }

  orgComparator(orgIdA, orgIdB) {
    const orgNameA = this.orgPipe.transform(orgIdA).toLowerCase();
    const orgNameB = this.orgPipe.transform(orgIdB).toLowerCase();

    if (orgNameA < orgNameB) {
      return -1;
    }
    if (orgNameA > orgNameB) {
      return 1;
    }
  }
}
