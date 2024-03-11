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
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  User,
  OrganizationPipe,
  OrganizationService,
  UserPipe,
} from "squacapi";
import { UserService } from "@user/services/user.service";
import { Subscription } from "rxjs";
import {
  TableColumn,
  TableControls,
  TableFilters,
  TableOptions,
} from "./interfaces";
import { SharedToggleFilter } from "@shared/components/sharing-toggle/sharing-toggle.interface";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { AbilityModule } from "@casl/angular";
import { SharingToggleComponent } from "../sharing-toggle/sharing-toggle.component";
import { SharedIndicatorComponent } from "../shared-indicator/shared-indicator.component";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { SearchFilterComponent } from "../search-filter/search-filter.component";

/**
 * Reusable table view component
 */
@Component({
  selector: "shared-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    AbilityModule,
    OrganizationPipe,
    UserPipe,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatPaginatorModule,
    SharingToggleComponent,
    SharedIndicatorComponent,
    LoadingDirective,
    SearchFilterComponent,
  ],
})
export class TableViewComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  subscription = new Subscription();
  @Input() title: string;
  @Input() options: TableOptions;
  @Input() rows: any[];
  @Input() columns: TableColumn[];
  @Input() controls: TableControls;
  @Input() filters: TableFilters;
  @Input() selectedRowId: number;
  @Input() isLoading: boolean;

  @Output() itemSelected = new EventEmitter<any>();
  @Output() controlClicked = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() filtersChanged = new EventEmitter<any>();

  userPipe: UserPipe;
  orgPipe: OrganizationPipe;
  searchString: string;
  hideShared: boolean;
  user: User;
  shareFilter = "org";

  //defaultOptions
  tableOptions: TableOptions = {
    autoRouteToDetail: true,
    messages: {
      emptyMessage: "No results found",
    },
    defaultSort: "name",
    defaultSortDir: "asc",
  };

  /** Mat sort directive, used to enable sorting on */
  @ViewChild(MatSort) sort: MatSort;
  /** columns shown in table */
  tableColumns: string[] = [];
  /** alert table data source */
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  /** selection on alert table */
  selection: SelectionModel<any> = new SelectionModel(false, []);
  /** table pagination */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** currently selected row */
  selectedRow: any;

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

  /**
   *
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //doubleclick on row to view detail?
  /**
   * Init
   */
  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = (
      row: any,
      sortHeaderId: string
    ): string => {
      switch (sortHeaderId) {
        case "owner":
          return this.userPipe.transform(row.owner);

        case "organization":
          return this.orgPipe.transform(row.orgId);

        case "privacy":
          return row.orgId;

        default:
          return row[sortHeaderId];
      }
    };
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
      this.tableColumns = this.columns.map((column) => column.columnDef);
    }
    if (changes["rows"] && changes["rows"].currentValue) {
      this.processRows();
    }
    if (changes["selectedRowId"] && !changes["selectedRowId"].firstChange) {
      this.selectResourceById(this.selectedRowId);
    }
  }

  /**
   * Set up table rows and select default row
   */
  private processRows(): void {
    this.dataSource.data = this.rows.slice();
    // if (this.selectedRowId && this.tableRows.length > 0) {
    //   this.selectResource(this.selectedRowId);
    // }
  }

  /**
   * Respond to select row event and emit row id
   *
   * @param row selected table row
   */
  selectRow(row: any): void {
    //already selected
    if (this.selection.isSelected(row)) {
      //view resource if doubleclicked
      if (this.tableOptions.autoRouteToDetail) {
        this.viewResource();
      }
      this.selectResource(null);
    } else {
      this.selectResource(row);
    }
    this.selection.toggle(row);
  }

  /**
   * Select resource in table by id
   *
   * @param row selected row
   */
  private selectResource(row: any): void {
    this.selectedRow = row;
    this.itemSelected.next(this.selectedRow);
  }

  /**
   * Select resource in table by id
   *
   * @param rowId id of resource
   */
  private selectResourceById(rowId: number): void {
    this.selectedRow = this.rows.find((row) => row.id === rowId);
    this.selection.select(this.selectedRow);
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
    this.dataSource.data = [...rows];
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
   * Change sharing settings and filter table to match
   *
   * @param params sharing filter params
   */
  toggleSharing(params: SharedToggleFilter): void {
    this.filtersChanged.emit(params);
  }

  /**
   * Destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
