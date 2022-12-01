import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewChild,
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

// Table of channel groups
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
  options = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    selectionType: "single",
    displayCheck: true,
  };
  // controls in table head
  controls = {
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
  filters = {
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
    public loadingService: LoadingService
  ) {}

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
          return this.loadingService.doLoading(this.fetchData());
        })
      )
      .subscribe();

    this.subscription.add(groupsSub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        {
          name: "Name",
          draggable: false,
          sortable: true,
        },
        { name: "Description", draggable: false, sortable: true },
        {
          name: "# Channels",
          prop: "channelsCount",
          draggable: false,
          sortable: true,
          width: 20,
        },
        {
          name: "Owner",
          prop: "owner",
          draggable: false,
          sortable: true,
          width: 50,
        },
        {
          name: "Org",
          prop: "orgId",
          draggable: false,
          sortable: true,
          width: 20,
        },
        {
          name: "Sharing",
          draggable: false,
          canAutoResize: false,
          width: 150,
          sortable: false,
          cellTemplate: this.sharingTemplate,
        },
      ];
    }, 0);
  }

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

  // get fresh groups
  refresh(filters?): void {
    if (filters) {
      this.queryParams = { ...filters };
    }

    this.loadingService.doLoading(this.fetchData(true), this).subscribe();
  }

  // onSelect function for data table selection
  onSelect(channelGroup): void {
    this.selectedChannelGroupId = channelGroup ? channelGroup.id : null;
  }

  // event emitted from table
  onClick(event): void {
    if (event === "delete" && this.selectedChannelGroupId) {
      this.onDelete();
    }
  }

  // delete channel group
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

  // route to create group
  addChannelGroup(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  // deselect group
  clearSelectedChannelGroup(): void {
    this.selectedChannelGroupId = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
