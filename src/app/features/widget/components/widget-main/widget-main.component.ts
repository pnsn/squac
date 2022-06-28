import { Component, OnDestroy, OnInit } from "@angular/core";
import { ViewService } from "@core/services/view.service";
import { Widget } from "@widget/models/widget";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "widget-main",
  templateUrl: "./widget-main.component.html",
  styleUrls: ["./widget-main.component.scss"],
})
export class WidgetMainComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading = true;
  inited = 0;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const widgetSub = this.viewService.widgetUpdated.subscribe(
      (widgetId: number) => {
        console.log("change widget: ", widgetId);
        const widget = this.viewService.getWidgetById(widgetId);
        this.updateWidget(widgetId, widget);
      }
    );
    this.canUpdate = this.viewService.canUpdate;

    //subscribe to router changes for when dashboards change
    const dataSub = this.route.data.subscribe((data) => {
      if (data.widgets.error) {
        this.error = "Could not load dashboard or widgets";
      } else {
        this.addWidgetsToView(data.widgets);
        // this.options.api.res
        this.viewService.setWidgets(data.widgets);
        // allow dragable and resizable if they have permission to edit dashboard
        this.options.draggable.enabled = this.canUpdate;
        this.options.resizable.enabled = this.canUpdate;
        if (this.options.api) {
          this.options.api.optionsChanged();
        }
      }
    });

    const resizeSub = this.viewService.resize.subscribe((widgetId) => {
      if (!widgetId) {
        this.options.api.resize();
      }
    });
    this.subscription.add(widgetSub);
    this.subscription.add(dataSub);
    this.subscription.add(resizeSub);
  }

  // save widgets after resize or move
  itemChange(item): void {
    item.widget.layout.columns = item.cols;
    item.widget.layout.rows = item.rows;
    item.widget.layout.x = item.x;
    item.widget.layout.y = item.y;
    this.viewService.saveWidgetResize(item.widget);
  }

  addWidget(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  trackBy(_index, item): number {
    return item.id;
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
      cols: widget.layout.columns ? widget.layout.columns : 1,
      rows: widget.layout.rows ? widget.layout.rows : 1,
      y: rePosition ? null : widget.layout.y,
      x: rePosition ? null : widget.layout.x,
      widget,
    };
    this.widgetItems.push(item);
  }

  // update widget or remove widget
  private updateWidget(widgetId: number, widget?: Widget): void {
    const index = this.widgetItems.findIndex((item) => {
      return widgetId === item.widget.id;
    });
    // delete existing widget
    if (index !== -1 && !widget) {
      this.widgetItems.splice(index, 1);
    } else if (index === -1 && widget) {
      //add new
      this.addWidgetToGrid(widget, true); //do the find position here
    } else {
      this.widgetItems[index].widget = widget;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
