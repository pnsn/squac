import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from './widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from './widgets.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ViewService } from '../shared/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';
@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() canUpdate: boolean;
  @Input() dashboardId: number;

  loading: boolean = true;
  inited = 0;
  subscription: Subscription = new Subscription();
  dialogRef;
  constructor(
    private widgetService: WidgetsService,
    private viewService: ViewService,
    private dialog: MatDialog
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
    gridSizeChanged:()=> {
      console.log("grid size changed")
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

  ngOnInit(): void {


    const widgetSub = this.viewService.currentWidgets.subscribe(
      (widgets: Widget[]) => {
        console.log('updated widgets')
        this.widgets = [];
        widgets.forEach(widget => {
          this.widgets.push({
            cols: widget.columns ? widget.columns : 1,
            rows: widget.rows ? widget.rows : 1,
            y: widget.y ? widget.y : 0,
            x: widget.x ? widget.x : 0,
            widget
          });
        });
        this.loading = false;
        // this.options.api.resize();
            //allow dragable and resizable if they have permission to edit dashboard
        this.options.draggable.enabled = this.canUpdate;
        this.options.resizable.enabled = this.canUpdate;
       if(this.options.api) { this.options.api.optionsChanged() };
      },
      error => {
        console.log(' error in widget: ' + error);
      }
    );
    this.subscription.add(widgetSub);
  }

  ngOnDestroy() {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
    this.subscription.unsubscribe();
  }


  addWidget() {
    // this.router.navigate(['widget', 'new'], {relativeTo: this.route});
    this.dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: null,
        dashboardId: this.dashboardId
      }
    });
    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          console.log('Dialog closed and widget saved');
          this.viewService.addWidget(result.id);
        } else {
          console.log('Dialog closed and not saved');
        }
      },
      error => {
        // this.error = 'Failed to save widget.';
        console.log('error during close of widget' + error);
      }
    );

  }
}




