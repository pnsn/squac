import {
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
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { User } from "@features/user/models/user";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Subscription, tap, filter } from "rxjs";
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
  clickCount = 0;
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

    if (this.controls.listenToRouter) {
      const currentPath = this.router.routerState.snapshot.url;
      const routerEvents = this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          tap((e: NavigationEnd) => {
            console.log(currentPath, e.urlAfterRedirects);
            if (e.urlAfterRedirects.toString() === currentPath) {
              this.refreshResource();
            }
          })
        )
        .subscribe();

      this.subscription.add(routerEvents);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.columns && changes.columns.currentValue) {
      this.processColumns();
    }
    if (changes.rows && changes.rows.currentValue) {
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
    this.columns.forEach((col) => {
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

  // selected id, view resource if doubleclicked
  onSelect(event) {
    if (event.selected) {
      if (this.selectedRow && this.selectedRow.id === event.selected[0].id) {
        this.clickCount++;
      } else {
        this.clickCount = 0;
      }
      this.selectResource(event.selected[0].id);
      //view resource if doubleclicked
      if (this.clickCount === 2) {
        this.clickCount = 0;
        this.viewResource();
      }
    }
  }
  selectGroupHeader() {
    console.log("group header selected");
  }
  selectResource(id) {
    this.selected = this.tableRows.filter((row) => {
      return row.id === id;
    });

    this.selectedRow = this.selected[0];
    this.itemSelected.next(this.selectedRow);
  }

  menuOption(action) {
    if (action === "edit") {
      this.editResource();
    } else if (action === "add") {
      this.addResource();
    } else if (action === "view") {
      this.viewResource();
    } else {
      this.controlClicked.emit(action);
    }
  }

  viewResource() {
    this.controlClicked.emit("view");
    let path;
    if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(this.selectedRow.id, null, path);
  }

  editResource() {
    this.controlClicked.emit("edit");
    let path;
    if (this.controls.edit && this.controls.edit.path) {
      path = this.controls.edit.path;
    } else if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(this.selectedRow.id, "edit", path);
  }

  addResource() {
    this.controlClicked.emit("add");
    let path;
    if (this.controls.add && this.controls.add.path) {
      path = this.controls.add.path;
    } else if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(null, "new", path);
  }

  routeTo(resource, action?, path?) {
    const route = [];
    if (path) {
      route.push(path);
    }
    if (resource) {
      route.push(resource);
    }
    if (action) {
      route.push(action);
    }
    this.router.navigate(route, {
      relativeTo: this.route,
    });
  }

  searchFieldChanged(rows) {
    this.hideShared = false;
    this.tableRows = [...rows];
  }

  refreshResource() {
    this.refresh.emit(true);
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

  toggleSharing(event) {
    let temp;
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

// options = {
//  **any of table options**
//   autoRouteToDetail: false,
//   footerLabel: "Metrics",
// };
// controls = {
//   resource: "Metric",
//   add: {
//     text: "Add Metric",
//     path?: "/metric"
//   },
//   actionMenu: {},
//   edit: {
//     text: "Edit Metric",
//   },
//   refresh: false,
// };
// filters = {
//   toggleShared: true,
//   searchField: {
//     text: "Type to filter...",
//     props: [""]
//   },
//   dateFilter: {}
//   propToggle: {
//
//   }
//
// };
