import { Component, OnDestroy, OnInit } from "@angular/core";
import { ViewService } from "@core/services/view.service";
import { Widget } from "@widget/models/widget";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Subscription } from "rxjs";
import { WidgetService } from "@widget/services/widget.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "widget-main",
  templateUrl: "./widget-main.component.html",
  styleUrls: ["./widget-main.component.scss"],
})
export class WidgetMainComponent implements OnInit, OnDestroy {
  // @Input() canUpdate: boolean;
  // @Input() dashboardId: number;

  loading = true;
  inited = 0;
  subscription: Subscription = new Subscription();
  error: string;
  canUpdate: boolean;
  constructor(
    private widgetService: WidgetService,
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  options: GridsterConfig = {
    draggable: {
      delayStart: 0,
      enabled: true,
      ignoreContentClass: "widget-detail",
      ignoreContent: false,
      dragHandleClass: "drag-handler",
      dropOverItems: false,
    },
    scrollToNewItems: true,
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
    compactType: "none",
    displayGrid: "onDrag&Resize",
    // scrollToNewItems: true,
    itemChangeCallback: (item) => {
      this.itemChange(item);
    },
    itemInitCallback: () => {
      this.inited++;
    },
  };

  widgets: Array<GridsterItem> = [];

  itemChange(item) {
    item.widget.layout.columns = item.cols;
    item.widget.layout.rows = item.rows;
    item.widget.layout.x = item.x;
    item.widget.layout.y = item.y;
    if (this.widgets && this.inited === this.widgets.length) {
      this.viewService.saveWidgetResize(item.widget);
    }
  }

  addWidget() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  trackBy(_index, item) {
    return item.id;
  }

  private addWidgetsToView(widgets: Widget[]) {
    this.widgets = [];
    if (widgets && widgets.length > 0) {
      widgets.forEach((widget) => {
        this.addWidgetToGrid(widget);
      });
    }
    this.loading = false;
  }

  addWidgetToGrid(widget: Widget, rePosition?: boolean) {
    const item = {
      cols: widget.layout.columns ? widget.layout.columns : 1,
      rows: widget.layout.rows ? widget.layout.rows : 1,
      y: rePosition ? null : widget.layout.y,
      x: rePosition ? null : widget.layout.x,
      widget,
    };
    this.widgets.push(item);
  }

  private updateWidget(widgetId: number, widget?: Widget) {
    const index = this.widgets.findIndex((item) => {
      return widgetId === item.widget.id;
    });
    // delete existing widget
    if (index !== -1 && !widget) {
      this.widgets.splice(index, 1);
    } else if (index === -1 && widget) {
      //add new
      this.addWidgetToGrid(widget, true); //do the find position here
    } else {
      this.widgets[index].widget = widget;
    }
  }

  ngOnInit(): void {
    const widgetSub = this.viewService.widgetUpdated.subscribe(
      (widgetId: number) => {
        console.log("change widget: ", widgetId);
        const widget = this.viewService.getWidgetById(widgetId);
        this.updateWidget(widgetId, widget);
      }
    );
    this.canUpdate = this.viewService.canUpdate;

    const data = this.route.snapshot.data;
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

    const resizeSub = this.viewService.resize.subscribe((widgetId) => {
      if (!widgetId) {
        this.options.api.resize();
      }
    });
    this.subscription.add(widgetSub);
    // this.subscription.add(dataSub);
    this.subscription.add(resizeSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
