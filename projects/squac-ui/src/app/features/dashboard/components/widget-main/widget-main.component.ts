import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ViewService } from "@dashboard/services/view.service";
import { Widget, WidgetConnectService } from "widgets";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Dashboard } from "squacapi";
import { AppAbility } from "@core/utils/ability";

/** Gridster item with widget */
interface WidgetGridsterItem extends GridsterItem {
  widget: Widget;
}
/**
 * Widget main component, handles grid view
 */
@Component({
  selector: "widget-main",
  templateUrl: "./widget-main.component.html",
  styleUrls: ["./widget-main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetMainComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading = true;
  inited = 0;
  dashboards: Dashboard[];
  sideNavOpened = true;
  error: string;
  canUpdate: boolean;

  options: GridsterConfig = {
    draggable: {
      delayStart: 0,
      enabled: true,
      ignoreContentClass: "widget-detail",
      ignoreContent: false,
      dragHandleClass: "drag-handler",
      dropOverItems: false,
    },
    scrollToNewItems: false, //will scroll to bottom on page load and is annoying
    gridType: "verticalFixed",
    fixedRowHeight: 50,
    minCols: 20,
    maxCols: 20,
    minRows: 20,
    margin: 5,
    pushItems: true,
    resizable: {
      enabled: true,
      handles: {
        s: true,
        e: true,
        n: false,
        w: false,
        se: true,
        ne: true,
        sw: true,
        nw: true,
      },
    },
    outerMargin: true,
    outerMarginRight: 10,
    outerMarginLeft: 10,
    mobileBreakpoint: 640,
    compactType: "compactUp&Left",
    displayGrid: "onDrag&Resize",
    // scrollToNewItems: true,
    itemChangeCallback: (item: WidgetGridsterItem) => {
      this.itemChange(item);
    },
    itemInitCallback: () => {
      this.inited++;
    },
  };

  widgetItems: Array<WidgetGridsterItem> = [];

  constructor(
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router,
    private ability: AppAbility,
    private widgetConnectService: WidgetConnectService,
    private cdr: ChangeDetectorRef
  ) {}

  /** subscrive to router and changes */
  ngOnInit(): void {
    const widgetSub = this.viewService.widgetUpdated.subscribe(
      (widgetId: number) => {
        const widget = this.viewService.getWidgetById(widgetId);
        this.updateWidget(widgetId, widget);
      }
    );

    const toggleChannelListSub =
      this.widgetConnectService.toggleChannelList.subscribe(
        (toggleChannelList: boolean) => {
          this.sideNavOpened = toggleChannelList;
        }
      );

    //subscribe to router changes for when dashboards change
    const dataSub = this.route.data.subscribe((data) => {
      const dashboardId = +this.route.snapshot.params["dashboardId"];
      if (data["widgets"].error) {
        this.error = "Could not load dashboard or widgets";
      } else {
        if (data["dashboard"] && data["dashboard"].id === dashboardId) {
          this.canUpdate = this.ability.can("update", data["dashboard"]);
        }
        if (data["dashboards"]) {
          this.dashboards = data["dashboards"].filter((d) => {
            return this.ability.can("update", d);
          });
        }
        this.addWidgetsToView(data["widgets"]);
        // this.options.api.res
        this.viewService.setWidgets(data["widgets"]);
        if (this.options.api) {
          this.options.api.optionsChanged();
        }
      }
    });

    this.subscription.add(toggleChannelListSub);
    this.subscription.add(widgetSub);
    this.subscription.add(dataSub);
  }

  // save widgets after resize or move
  /**
   * Save widgets after resize or move,
   * if able to
   *
   * @param item changed grid item
   */
  itemChange(item: WidgetGridsterItem): void {
    item.widget.layout.columns = item.cols;
    item.widget.layout.rows = item.rows;
    item.widget.layout.x = item.x;
    item.widget.layout.y = item.y;
    if (this.canUpdate) {
      this.viewService.saveWidget(item.widget, ["layout"]);
    }
  }

  /** Navigate to add widget */
  addWidget(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  /**
   * Trackby function for html
   *
   * @param _index item index
   * @param item item
   * @returns id
   */
  trackBy(_index: number, item: WidgetGridsterItem): number {
    return item.widget.id;
  }

  /** Toggles dashboard sidenav */
  toggleSidenav(): void {
    if (this.options.api) {
      this.options.api.resize();
    }
  }

  /**
   * Adds widgets to view
   *
   * @param widgets widget array to add
   */
  private addWidgetsToView(widgets: Widget[]): void {
    this.widgetItems = [];
    if (widgets && widgets.length > 0) {
      widgets.forEach((widget) => {
        this.addWidgetToGrid(widget);
      });
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  /**
   * Adds individual widget to grid
   *
   * @param widget widget to add
   * @param rePosition true if widget position needs to be reset
   */
  addWidgetToGrid(widget: Widget, rePosition?: boolean): void {
    const item: WidgetGridsterItem = {
      cols: widget.layout.columns ? widget.layout.columns : 10,
      rows: widget.layout.rows ? widget.layout.rows : 5,
      y: rePosition ? null : widget.layout.y,
      x: rePosition ? null : widget.layout.x,
      widget,
    };
    this.widgetItems.push(item);
    this.cdr.detectChanges();
  }

  /**
   * Updates or removes widget, widget will be removed if only id is passed
   *
   * @param widgetId id of widget to change
   * @param widget widget to update or add
   */
  private updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.widgetItems.findIndex((item) => {
      return widgetId === item["widget"].id;
    });
    // delete existing widget
    if (index !== -1 && !widget) {
      this.widgetItems.splice(index, 1);
    } else if (index === -1 && widget) {
      //add ne
      this.addWidgetToGrid(widget, true); //do the find position here
    } else {
      this.widgetItems[index]["widget"] = widget;
    }
    if (widget) {
      this.viewService.updateData.next({ widget: widgetId });
    }
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
