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
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { User } from "squacapi";
import { OrganizationService } from "squacapi";
import { UserService } from "@user/services/user.service";
import { OrganizationPipe } from "squacapi";
import { UserPipe } from "squacapi";
import {
  ColumnMode,
  SelectionType,
  SortType,
} from "@boring.devs/ngx-datatable";
import { Subscription, tap, filter } from "rxjs";
import { TableControls, TableFilters, TableOptions } from "./interfaces";
import { SharedToggleFilter } from "../sharing-toggle/sharing-toggle.interface";

/**
 * Reusable table view component
 */
@Component({
  selector: "shared-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit, OnDestroy, OnChanges {
  subscription = new Subscription();
  @Input() title: string;
  @Input() options: TableOptions;
  @Input() rows: any[];
  @Input() columns: any[];
  @Input() controls: TableControls;
  @Input() filters: TableFilters;
  @Input() selectedRowId: number;
  @Input() resize: boolean;
  @Input() groupHeaderTemplate: TemplateRef<any>;
  @Input() tableFooterTemplate: TemplateRef<any>;
  @Input() rowDetailTemplate: TemplateRef<any>;
  @Input() isLoading: boolean;
  @Input() dataService: any;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() controlClicked = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() filtersChanged = new EventEmitter<any>();
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

  //defaultOptions
  tableOptions: TableOptions = {
    columnMode: ColumnMode.force,
    selectionType: SelectionType.single,
    headerHeight: 30,
    footerHeight: 30,
    rowHeight: "auto",
    limit: undefined,
    reorderable: false,
    scrollbarH: false,
    scrollbarV: true,
    sortType: SortType.single,
    sorts: [],
    groupRowsBy: undefined,
    groupExpansionDefault: false,
    groupParentType: undefined,
    autoRouteToDetail: true,
    selectAllRowsOnPage: false,
    displayCheck: false,
    messages: {
      emptyMessage: "No data",
      totalMessage: "total",
    },
    virtualization: false,
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    orgService: OrganizationService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }
  //doubleclick on row to view detail?

  /**
   * Init
   */
  ngOnInit(): void {
    Object.keys(this.options).forEach((key) => {
      this.tableOptions[key] = this.options[key];
    });
    const userServ = this.userService.user.subscribe({
      next: (user) => {
        this.user = user;
        if (this.rows) {
          this.processRows();
        }
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
              // this.refreshResource();
              this.selectResource(null);
            }
          })
        )
        .subscribe();

      this.subscription.add(routerEvents);
    }
  }

  /**
   * Respond to input changes
   *
   * @param changes changes object
   */
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes["columns"] && changes["columns"].currentValue) {
      this.processColumns();
    }
    if (changes["rows"] && changes["rows"].currentValue) {
      this.processRows();
    }
    if (changes["selectedRowId"] && !changes["selectedRowId"].firstChange) {
      this.selectResource(this.selectedRowId);
    }

    if (changes["resize"]) {
      if (this.table) {
        this.table.recalculate();
      }
    }
  }

  /**
   * Build table columns
   */
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

  /**
   * Set up table rows and select default row
   */
  private processRows(): void {
    this.tableRows = [...this.rows];
    if (this.selectedRowId && this.tableRows.length > 0) {
      this.selectResource(this.selectedRowId);
    }
  }

  /**
   * Respond to select row event and emit row id
   *
   * @param event click event
   */
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

  /**
   * When group header option is enabled, will respond to selects
   * on group header
   *
   * @param group id of group
   */
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

  /**
   * Select resource in table by id
   *
   * @param id id of resource
   */
  private selectResource(id: number): void {
    this.selected = [];
    this.selected = this.tableRows.filter((row) => {
      return row.id === id;
    });
    this.selectedRow = this.selected[0];
    this.itemSelected.next(this.selectedRow);
  }

  // FIXME: make into types
  /**
   * Respond to menu option
   *
   * @param action menu action
   */
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

  /**
   * Delete selected resource
   */
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

  /**
   * Route to selected resource
   */
  viewResource(): void {
    this.controlClicked.emit("view");
    let path;
    if (this.controls.menu && this.controls.menu.path) {
      path = this.controls.menu.path;
    }
    this.routeTo(this.selectedRow.id, null, path);
  }

  /**
   * Emit edit event and route to edit path
   */
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

  /**
   * Emit add resource event and route to 'new' path
   */
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

  /**
   * Handles routing to a resource
   *
   * @param resource resource to route to
   * @param action route action
   * @param path additional path config
   */
  routeTo(resource: string, action?: string, path?: string): void {
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

  /**
   * Update rows after search performed
   *
   * @param rows filtered rows from search
   */
  searchFieldChanged(rows: any[]): void {
    this.hideShared = false;
    this.tableRows = [...rows];
  }

  /**
   * Emit refresh event
   */
  refreshResource(): void {
    this.refresh.emit(true);
  }

  /**
   * Emit control click event
   *
   * @param type type of click event
   */
  controlClick(type: string): void {
    this.controlClicked.emit(type);
  }

  /**
   * Toggle expand or collapse group
   *
   * @param group group id
   * @returns if should toggle
   */
  toggleExpandGroup(group): boolean {
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }

  /**
   * Change sharing settings and filter table to match
   * @param filters from toggle
   */
  toggleSharing(params: SharedToggleFilter): void {
    this.filtersChanged.emit(params);
  }

  /**
   * Sort users by name
   *
   * @param userIdA first user
   * @param userIdB second user
   * @returns sort number
   */
  private userComparator(userIdA, userIdB): number {
    const userNameA = this.userPipe.transform(userIdA).toLowerCase();
    const userNameB = this.userPipe.transform(userIdB).toLowerCase();

    if (userNameA < userNameB) {
      return -1;
    }
    if (userNameA > userNameB) {
      return 1;
    }
    return 0;
  }

  /**
   * Sort organization by name
   *
   * @param orgIdA first org
   * @param orgIdB second org
   * @returns sort numbera
   */
  private orgComparator(orgIdA, orgIdB): number {
    const orgNameA = this.orgPipe.transform(orgIdA).toLowerCase();
    const orgNameB = this.orgPipe.transform(orgIdB).toLowerCase();

    if (orgNameA < orgNameB) {
      return -1;
    }
    if (orgNameA > orgNameB) {
      return 1;
    }
    return 0;
  }

  /**
   * Destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
