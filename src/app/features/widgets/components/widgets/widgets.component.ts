import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewService } from '@core/services/view.service';
import { Widget } from '@features/widgets/models/widget';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { WidgetsService } from '../../services/widgets.service';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit, OnDestroy {
  // @Input() canUpdate: boolean;
  // @Input() dashboardId: number;

  loading = true;
  inited = 0;
  subscription: Subscription = new Subscription();

  canUpdate: boolean;
  constructor(
    private widgetService: WidgetsService,
    private viewService: ViewService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  options: GridsterConfig = {
    draggable: {
      delayStart: 0,
      enabled: true,
      ignoreContentClass: 'widget-detail',
      ignoreContent: false,
      dragHandleClass: 'drag-handler',
      dropOverItems: false
    },
    gridType: 'verticalFixed',
    fixedRowHeight: 100,
    minCols: 20,
    maxCols: 20,
    minRows: 20,
    pushItems: true,
    resizable: {
      enabled: true,
      handles: {s: true, e: true, n: false, w: false, se: true, ne: true, sw: true, nw: true}
    },
    outerMargin: true,
    mobileBreakpoint: 640,
    compactType: 'none',
    displayGrid: 'onDrag&Resize',
    scrollToNewItems: true,
    itemChangeCallback: (item) => {this.itemChange(item); },
    itemInitCallback : (item) => {this.inited++; },
    gridSizeChanged: () => {
      console.log('grid size changed');
    }
  };

widgets: Array<GridsterItem> = [];

itemChange(item) {
  item.widget.columns = item.cols;
  item.widget.rows = item.rows;
  item.widget.x = item.x;
  item.widget.y = item.y;
  if (this.widgets && this.inited === this.widgets.length) {
    this.widgetService.updateWidget(item.widget).subscribe(
      success => {
        console.log('widgets saved');
      },
      error => {
        console.log('error in widget update: ', error);
      }
    );
    this.viewService.resizeWidget(item.widget.id);
  }
}

addWidget() {
  this.router.navigate(['new'], {relativeTo: this.route});

}

private addWidgetsToView(widgets: Widget[]) {
  this.widgets = [];
  if (widgets && widgets.length > 0) {
    widgets.forEach(widget => {
      this.widgets.push({
        cols: widget.columns ? widget.columns : 1,
        rows: widget.rows ? widget.rows : 1,
        y: widget.y ? widget.y : 0,
        x: widget.x ? widget.x : 0,
        widget
      });
    });
  }
  this.loading = false;

}
  ngOnInit(): void {
    this.viewService.currentWidgets.subscribe(
      widgets => {
        this.addWidgetsToView(widgets);
      }
    );
    this.canUpdate = this.viewService.canUpdate;

    this.route.data.subscribe(
      data => {
        this.addWidgetsToView(data.widgets);
        // this.options.api.res
        this.viewService.setWidgets(data.widgets);
            // allow dragable and resizable if they have permission to edit dashboard
        this.options.draggable.enabled = this.canUpdate;
        this.options.resizable.enabled = this.canUpdate;
        if (this.options.api) { this.options.api.optionsChanged(); }
      }
    );
  }

  ngOnDestroy() {
    console.log("widgets destroyed")
    this.subscription.unsubscribe();
  }


}




