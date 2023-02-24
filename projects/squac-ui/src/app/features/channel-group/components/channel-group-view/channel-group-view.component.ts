import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef,
} from "@angular/core";
import { ChannelGroup } from "squacapi";
import {
  catchError,
  EMPTY,
  Observable,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ChannelGroupService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";
import {
  MenuAction,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";

/**
 * Table of channel groups
 */
@Component({
  selector: "channel-group-view",
  templateUrl: "./channel-group-view.component.html",
  styleUrls: ["./channel-group-view.component.scss"],
})
export class ChannelGroupViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscription: Subscription = new Subscription();
  @ViewChild("sharingTemplate") sharingTemplate: TemplateRef<any>;
  channelGroups: ChannelGroup[] = [];
  selectedChannelGroupId: number;

  // config for table
  columns = [];
  rows = [];
  options: TableOptions = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    displayCheck: true,
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
    //TODO: prevent loading everytime you go back...but also respond to changes
    const groupsSub = this.route.params
      .pipe(
        tap(() => {
          const orgId = this.route.snapshot.data["user"].orgId;
          this.queryParams = { organization: orgId };
          this.selectedChannelGroupId =
            this.route.children.length > 0
              ? +this.route.snapshot.firstChild.params["channelGroupId"]
              : null;
        }),
        switchMap(() => {
          return this.loadingService.doLoading(this.fetchData(), this);
        })
      )
      .subscribe();

    this.subscription.add(groupsSub);
  }

  /**
   * Build channel group columns
   */
  ngAfterViewInit(): void {
    this.columns = [
      {
        name: "Name",
        draggable: false,
        sortable: true,
      },
      { name: "Description", draggable: false, sortable: true },
      {
        name: "Channels",
        prop: "channelsCount",
        draggable: false,
        sortable: true,
        width: 25,
      },
      {
        name: "Owner",
        prop: "owner",
        draggable: false,
        sortable: true,
        width: 50,
      },
      {
        name: "Org.",
        prop: "orgId",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 70,
      },
      {
        name: "Sharing",
        draggable: false,
        canAutoResize: false,
        width: 70,
        sortable: false,
        cellTemplate: this.sharingTemplate,
      },
    ];
    this.cdr.detectChanges();
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
