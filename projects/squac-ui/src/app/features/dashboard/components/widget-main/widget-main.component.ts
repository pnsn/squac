import { Component, OnDestroy, OnInit } from "@angular/core";
import { ViewService } from "@dashboard/services/view.service";
import { Widget } from "widgets";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Dashboard } from "squacapi";
import { AppAbility } from "@core/utils/ability";
@Component({
  selector: "widget-main",
  templateUrl: "./widget-main.component.html",
  styleUrls: ["./widget-main.component.scss"],
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
    itemChangeCallback: (item) => {
      this.itemChange(item);
    },
    itemInitCallback: () => {
      this.inited++;
    },
  };

  widgetItems: Array<GridsterItem> = [];

  constructor(
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router,
    private ability: AppAbility
  ) {}

  ngOnInit(): void {
    const widgetSub = this.viewService.widgetUpdated.subscribe(
      (widgetId: number) => {
        const widget = this.viewService.getWidgetById(widgetId);
        this.updateWidget(widgetId, widget);
      }
    );

    //subscribe to router changes for when dashboards change
    const dataSub = this.route.data.subscribe((data) => {
      const dashboardId = +this.route.snapshot.params["dashboardId"];
      if (data["widgets"].error) {
        this.error = "Could not load dashboard or widgets";
      } else {
        if (data["dashboards"]) {
          this.dashboards = data["dashboards"].filter((d) => {
            const canUpdate = this.ability.can("update", d);
            if (d.id === dashboardId) {
              this.canUpdate = canUpdate;
            }
            return canUpdate;
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

    this.subscription.add(widgetSub);
    this.subscription.add(dataSub);
  }

  // save widgets after resize or move
  itemChange(item): void {
    item.widget.layout.columns = item.cols;
    item.widget.layout.rows = item.rows;
    item.widget.layout.x = item.x;
    item.widget.layout.y = item.y;
    if (this.canUpdate) {
      this.viewService.saveWidget(item.widget);
    }
  }

  addWidget(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  trackBy(_index, item): number {
    return item.id;
  }

  toggleSidenav(): void {
    if (this.options.api) {
      this.options.api.resize();
    }
  }

  private addWidgetsToView(widgets: Widget[]): void {
    this.widgetItems = [];
    if (widgets && widgets.length > 0) {
      widgets.forEach((widget) => {
        this.addWidgetToGrid(widget);
      });
    }
    this.loading = false;
  }

  // insert grid item into widget
  addWidgetToGrid(widget: Widget, rePosition?: boolean): void {
    const item = {
      cols: widget.layout.columns ? widget.layout.columns : 10,
      rows: widget.layout.rows ? widget.layout.rows : 5,
      y: rePosition ? null : widget.layout.y,
      x: rePosition ? null : widget.layout.x,
      widget,
    };
    this.widgetItems.push(item);
  }

  // update widget or remove widget
  private updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.widgetItems.findIndex((item) => {
      return widgetId === item["widget"].id;
    });
    // delete existing widget
    if (index !== -1 && !widget) {
      this.widgetItems.splice(index, 1);
    } else if (index === -1 && widget) {
      //add new
      this.addWidgetToGrid(widget, true); //do the find position here
    } else {
      this.widgetItems[index]["widget"] = widget;
    }
    if (widget) {
      this.viewService.updateData.next({ widget: widgetId });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
