import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { ChannelGroup } from "squacapi";
import { catchError, EMPTY, Observable, Subscription, tap } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ChannelGroupService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";
import {
  MenuAction,
  TableColumn,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Table of channel groups
 */
@Component({
  selector: "channel-group-view",
  templateUrl: "./channel-group-view.component.html",
  styleUrls: ["./channel-group-view.component.scss"],
})
export class ChannelGroupViewComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @ViewChild("sharingTemplate") sharingTemplate: TemplateRef<any>;
  channelGroups: ChannelGroup[] = [];
  selectedChannelGroupId: number;

  // config for table
  rows = [];
  options: TableOptions = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    displayCheck: true,
  };

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/channel-groups",
    titleButtons: {
      addButton: true,
      useText: true,
    },
  };

  // controls in table head
  controls: TableControls = {
    listenToRouter: true,
    basePath: "/channel-groups",
    resource: "ChannelGroup",
    add: {
      text: "Add Channel Group",
    },
    menu: {
      text: "Actions",
      options: [
        {
          text: "View",
          permission: "read",
          action: "view",
        },
        {
          text: "Edit",
          permission: "update",
          action: "edit",
        },
        {
          text: "Delete",
          permission: "delete",
          action: "delete",
        },
      ],
    },
    refresh: true,
  };

  columns: TableColumn[] = [
    {
      name: "Name",
      columnDef: "name",
    },
    { name: "Description", columnDef: "description" },
    {
      name: "Channels",
      columnDef: "channelsCount",
    },
    {
      name: "Owner",
      columnDef: "owner",
    },
    {
      name: "Org.",
      columnDef: "organization",
    },
    {
      name: "Sharing",
      columnDef: "sharing",
    },
  ];

  // settings for which filters to show
  filters: TableFilters = {
    toggleShared: true,
    searchField: {
      text: "Filter channel groups...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  queryParams: Params;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * listen to route param changes
   */
  ngOnInit(): void {
    // get channel group info from route
    //TODO: prevent loading everytime you go back...but also respond to changes
    const routeSub = this.route.data
      .pipe(
        tap((data: any) => {
          const orgId = this.route.snapshot.data["user"].orgId;
          // default show only org
          this.channelGroups = data["channelGroups"].filter(
            (cg: ChannelGroup) => cg.orgId === orgId
          );
          this.queryParams = { organization: orgId };
        })
      )
      .subscribe({
        next: () => {
          this.rows = [...this.channelGroups];
        },
      });

    this.subscription.add(routeSub);
  }

  /**
   * Request channel groups
   *
   * @param refresh will use cache if false
   * @returns requested channel groups
   */
  fetchData(refresh?: boolean): Observable<ChannelGroup[]> {
    return this.channelGroupService.list(this.queryParams, refresh).pipe(
      tap((results) => {
        this.channelGroups = results;
        this.rows = [...this.channelGroups];
      }),
      catchError(() => {
        // this.error = error;
        return EMPTY;
      })
    );
  }

  /**
   * Request channel groups without cache
   *
   * @param filters existing search filters
   */
  refresh(filters?): void {
    if (filters) {
      this.queryParams = { ...filters };
    }

    this.loadingService.doLoading(this.fetchData(true), this).subscribe();
  }

  /**
   * Onselect function for datatable selection
   *
   * @param channelGroup selected channel group
   */
  onSelect(channelGroup: ChannelGroup): void {
    this.selectedChannelGroupId = channelGroup ? channelGroup.id : null;
  }

  /**
   * Click event emitted from table
   *
   * @param event menu event
   */
  onClick(event: MenuAction): void {
    if (event === "delete" && this.selectedChannelGroupId) {
      this.onDelete();
    }
  }

  /**
   * Delete selected channel group
   */
  onDelete(): void {
    this.channelGroupService
      .delete(this.selectedChannelGroupId)
      .subscribe(() => {
        const index = this.channelGroups.findIndex(
          (cG) => cG.id === this.selectedChannelGroupId
        );
        this.channelGroups.splice(index, 1);
      });
  }

  /**
   * Navigates to create channel group
   */
  addChannelGroup(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  /**
   * Deselected channel group
   */
  clearSelectedChannelGroup(): void {
    this.selectedChannelGroupId = null;
  }

  /**
   * unsubscribes
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
