import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "@features/user/models/user";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
@Component({
  selector: "shared-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit, OnDestroy, OnChanges {
  rowCount = 3;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  @Input() title: string;
  // @Output() refresh = new EventEmitter<boolean>();
  @Input() options;
  @Input() rows;
  @Input() columns;
  @Input() controls;
  @Input() filters;
  @Input() selectedRowId;
  @Input() groupHeaderTemplate: TemplateRef<any>;
  @Input() tableFooterTemplate: TemplateRef<any>;
  @Input() rowDetailTemplate: TemplateRef<any>;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() controlClicked = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @ViewChild("table") table;
  @ViewChild("nameTemplate") nameTemplate: TemplateRef<any>;
  userPipe;
  orgPipe;
  tableRows;
  tableColumns;
  searchString;
  hideShared;
  subscription = new Subscription();
  selected = [];
  selectedRow;
  user: User;
  constructor(
    private userService: UserService,
    private orgService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute
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
    groupRowsBy: undefined,
    groupExpansionDefault: false,
    autoRouteToDetail: true,
    messages: {
      emptyMessage: "No data",
      totalMessage: "total",
    },
  };
  //doubleclick on row to view detail?
  ngOnInit() {
    Object.keys(this.options).forEach((key) => {
      if (this.options[key]) {
        this.tableOptions[key] = this.options[key];
      }
    });
    const userServ = this.userService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    this.subscription.add(userServ);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.columns && changes.columns.currentValue) {
      this.processColumns();
    }
    if (changes.rows && changes.rows.currentValue) {
      console.log("row changes");
      this.tableRows = [...this.rows];
    }
    if (changes.selectedRowId && changes.selectedRowId) {
      this.selectResource(this.selectedRowId);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      if (
        this.options.autoRouteToDetail &&
        (col.prop === "name" || col.name === "Name")
      ) {
        col.cellTemplate = this.nameTemplate;
      }
    });
    this.tableColumns = [...this.columns];
  }

  onSelect(event) {
    if (event.selected) {
      this.selectResource(event.selected[0].id);
    }
  }

  selectResource(id) {
    this.selected = this.tableRows.filter((row) => {
      return row.id === id;
    });

    this.selectedRow = this.selected[0];
    this.itemSelected.next(this.selectedRow);
  }

  editResource() {
    this.controlClicked.emit("edit");
    this.router.navigate([this.selectedRow.id, "edit"], {
      relativeTo: this.route,
    });
  }

  addResource() {
    this.controlClicked.emit("add");
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  refreshResource() {
    this.controlClicked.emit("refresh");
  }

  onDetailToggle(event) {
    console.log(event);
  }

  controlClick(type) {
    this.controlClicked.emit(type);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }

  updateFilter(event) {
    let val = event.target.value;

    if (val) {
      this.hideShared = false;
      val = val.toLowerCase();
      // filter our data
      const temp = this.rows.filter((row) => {
        const test =
          row.name?.toLowerCase().indexOf(val) !== -1 ||
          row.description?.toLowerCase().indexOf(val) !== -1 ||
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
    this.tableRows = [...this.rows];
    this.searchString = "";
  }

  toggleSharing(event) {
    let temp;
    console.log(event);
    if (event.value === "user") {
      temp = this.rows.filter((row) => {
        return this.user.id === row.owner;
      });
    } else if (event.value === "org") {
      temp = this.rows.filter((row) => {
        return this.user.orgId === row.orgId;
      });
    } else {
      //value === 'all'
      temp = [...this.rows];
    }
    this.tableRows = temp;
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
