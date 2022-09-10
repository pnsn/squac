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
import { ChannelGroup } from "@core/models/channel-group";
import { PagedData, PageInfo } from "@core/models/page";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { User } from "@features/user/models/user";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { Subscription, tap, filter } from "rxjs";
export class Page {
  // The number of elements in the page
  size: number = 0;
  // The total number of elements
  totalElements: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // The current page number
  pageNumber: number = 0;
}
@Component({
  selector: "shared-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit, OnDestroy, OnChanges {
  subscription = new Subscription();
  @Input() title: string;
  @Input() options: any;
  @Input() rows: any[];
  @Input() columns: any[];
  @Input() controls: any;
  @Input() filters: any;
  @Input() selectedRowId: number;
  @Input() resize: boolean;
  @Input() groupHeaderTemplate: TemplateRef<any>;
  @Input() tableFooterTemplate: TemplateRef<any>;
  @Input() rowDetailTemplate: TemplateRef<any>;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() controlClicked = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @ViewChild("table") table;
  @ViewChild("nameTemplate") nameTemplate: TemplateRef<any>;
  @ViewChild("checkboxTemplate") checkboxTemplate: TemplateRef<any>;
  userPipe: UserPipe;
  orgPipe: OrganizationPipe;
  tableRows: any[];
  tableColumns: any[];
  searchString: string;
  hideShared: boolean;

  selected = [];
  selectedRow;
  user: User;
  clickCount = 0;
  selectedGroupKey;
  shareFilter = "org";

  // paging & sorting
  pageNumber = 0;
  totalElements = 0;
  cache: any = {};
  isLoading = 0;

  //defaultOptions
  tableOptions = {
    columnMode: ColumnMode.force,
    selectionType: undefined,
    headerHeight: "30",
    footerHeight: "30",
    rowHeight: "auto",
    limit: undefined,
    reorderable: false,
    scrollbarH: false,
    scrollbarV: false,
    sortType: "single",
    sorts: [],
    groupRowsBy: undefined,
    groupExpansionDefault: false,
    groupParentType: undefined,
    autoRouteToDetail: true,
    selectAllRowsOnPage: false,
    displayCheck: false,
    externalPaging: false,
    externalSorting: false,
    messages: {
      emptyMessage: "No data",
      totalMessage: "total",
    },
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private channelGroupService: ChannelGroupService,
    orgService: OrganizationService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
    this.pageNumber = 0;
  }
  //doubleclick on row to view detail?
  ngOnInit() {
    Object.keys(this.options).forEach((key) => {
      this.tableOptions[key] = this.options[key];
    });
    const userServ = this.userService.user.subscribe({
      next: (user) => {
        this.user = user;
        this.processRows();
      },
    });

    this.subscription.add(userServ);
    if (this.controls.listenToRouter) {
      const currentPath =
        this.controls.basePath || this.router.routerState.snapshot.url;
      const routerEvents = this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          tap((e: NavigationEnd) => {
            if (e.urlAfterRedirects.toString() === currentPath) {
              this.refreshResource();
            }
          })
        )
        .subscribe();

      this.subscription.add(routerEvents);
    }

    // this.page({
    //   offset: 0,
    //   pageSize: 3,
    //   limit: 3,
    //   count: 0,
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.columns && changes.columns.currentValue) {
      this.processColumns();
    }
    if (changes.rows && changes.rows.currentValue) {
      this.processRows();
    }
    if (changes.selectedRowId && changes.selectedRowId.currentValue) {
      this.selectResource(this.selectedRowId);
    }

    if (changes.resize) {
      if (this.table) {
        this.table.recalculate();
      }
    }
  }

  // build columns
  private processColumns(): void {
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
        this.tableOptions.autoRouteToDetail &&
        (col.prop === "name" || col.name === "Name")
      ) {
        col.cellTemplate = this.nameTemplate;
      }
    });
    this.tableColumns = [...this.columns];
  }

  // filter rows
  private processRows(): void {
    this.toggleSharing();
  }

  // selected id, view resource if doubleclicked
  onSelect(event): void {
    if (event.selected && event.selected[0]) {
      if (this.selectedRow && this.selectedRow.id === event.selected[0].id) {
        this.clickCount++;
      } else {
        this.clickCount = 0;
      }

      this.selectResource(event.selected[0].id);
      //view resource if doubleclicked
      if (this.clickCount === 2 && this.tableOptions.autoRouteToDetail) {
        this.clickCount = 0;
        this.viewResource();
      }
    }
    if (!event.selected[0]) {
      //unselect
      this.selectResource(null);
      this.clickCount = 0;
    }
  }

  // select the group header
  selectGroupHeader(group): void {
    if (this.tableOptions.groupParentType) {
      this.selectedGroupKey = group.key;
      const groupParent = group.value[0][this.tableOptions.groupParentType];

      this.selectedRow = groupParent;
      this.itemSelected.next(this.selectedRow);
    } else {
      this.selectedGroupKey = null;
      this.selectedRow = null;
    }
  }

  // select resource in table
  private selectResource(id: number): void {
    this.selected = [];
    this.selected = this.tableRows.filter((row) => {
      return row.id === id;
    });

    this.selectedRow = this.selected[0];
    this.itemSelected.next(this.selectedRow);
  }

  // choose method based on action
  menuOption(action: string): void {
    if (action === "edit") {
      this.editResource();
    } else if (action === "add") {
      this.addResource();
    } else if (action === "view") {
      this.viewResource();
    } else if (action === "delete") {
      this.deleteResource();
    } else {
      this.controlClicked.emit(action);
    }
  }

  // delete resource
  deleteResource(): void {
    this.confirmDialog.open({
      title: `Delete ${this.selectedRow.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.controlClicked.emit("delete");
      }
    });
  }

  // emit view resource and route to resource
  viewResource(): void {
    this.controlClicked.emit("view");
    let path;
    if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(this.selectedRow.id, null, path);
  }

  // emit edit resource and route to 'edit' path
  editResource(): void {
    this.controlClicked.emit("edit");
    let path;
    if (this.controls.edit && this.controls.edit.path) {
      path = this.controls.edit.path;
    } else if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(this.selectedRow.id, "edit", path);
  }

  // emit add resource and route to 'new' path
  addResource(): void {
    this.controlClicked.emit("add");
    let path;
    if (this.controls.add && this.controls.add.path) {
      path = this.controls.add.path;
    } else if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(null, "new", path);
  }

  // set up route to resource
  // path: monitors
  // action: edit
  // resource: monitor
  routeTo(resource, action?, path?): void {
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

  // update rows after search
  searchFieldChanged(rows): void {
    this.hideShared = false;
    this.tableRows = [...rows];
  }

  // emit refresh
  refreshResource(): void {
    this.refresh.emit(true);
  }

  page(pageInfo: PageInfo) {
    console.log(pageInfo);
    // Current page number is determined by last call to setPage
    // This is the page the UI is currently displaying
    // The current page is based on the UI pagesize and scroll position
    // Pagesize can change depending on browser size
    this.pageNumber = pageInfo.offset;
    // Calculate row offset in the UI using pageInfo
    // This is the scroll position in rows
    const rowOffset = pageInfo.offset * pageInfo.pageSize;
    // When calling the server, we keep page size fixed
    // This should be the max UI pagesize or larger
    // This is not necessary but helps simplify caching since the UI page size can change

    const page = new Page();
    page.size = 10;
    page.pageNumber = Math.floor(rowOffset / page.size);
    // console.log(rowOffset, rowOffset / page.size, page.pageNumber);
    // We keep a index of server loaded pages so we don't load same data twice
    // This is based on the server page not the UI
    if (this.cache[rowOffset]) return;
    this.cache[rowOffset] = true;

    // Counter of pending API calls
    this.isLoading++;

    const params = {
      offset: rowOffset,
      limit: page.size,
    };

    this.channelGroupService
      .getPagedChannelGroups(params)
      .subscribe((pagedData: PagedData) => {
        // Update total count
        this.totalElements = pagedData.count;
        console.log(pagedData.results);
        // Create array to store data if missing
        // The array should have the correct number of with "holes" for missing data
        if (!this.tableRows) {
          this.tableRows = new Array<ChannelGroup>(this.totalElements || 0);
        }

        const start = params.offset;

        // Copy existing data
        const tableRows = [...this.tableRows];
        console.log(start, page.size, page.pageNumber);
        // Insert new rows into correct position
        tableRows.splice(start, page.size, ...pagedData.results);

        // Set rows to our new rows for display
        this.tableRows = tableRows;

        // Decrement the counter of pending API calls
        this.isLoading--;
      });
  }

  // emit control click event with type
  controlClick(type): void {
    this.controlClicked.emit(type);
  }

  // expand group
  toggleExpandGroup(group): boolean {
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }

  // change sharing settings and filter table to match
  toggleSharing(): void {
    let temp;
    if (this.filters.toggleShared && this.shareFilter === "user" && this.user) {
      temp = this.rows.filter((row) => {
        return this.user.id === row.owner;
      });
    } else if (
      this.filters.toggleShared &&
      this.shareFilter === "org" &&
      this.user
    ) {
      temp = this.rows.filter((row) => {
        return this.user.orgId === row.orgId;
      });
    } else {
      //value === 'all'
      temp = [...this.rows];
    }
    this.tableRows = temp;
  }

  //sort users by name
  private userComparator(userIdA, userIdB): number {
    const userNameA = this.userPipe.transform(userIdA).toLowerCase();
    const userNameB = this.userPipe.transform(userIdB).toLowerCase();

    if (userNameA < userNameB) {
      return -1;
    }
    if (userNameA > userNameB) {
      return 1;
    }
  }

  //sort organizations by name
  private orgComparator(orgIdA, orgIdB): number {
    const orgNameA = this.orgPipe.transform(orgIdA).toLowerCase();
    const orgNameB = this.orgPipe.transform(orgIdB).toLowerCase();

    if (orgNameA < orgNameB) {
      return -1;
    }
    if (orgNameA > orgNameB) {
      return 1;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
