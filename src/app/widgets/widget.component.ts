import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from './widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from './widgets.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  inited = 0;
  subscription: Subscription = new Subscription();
  constructor(
    private widgetService: WidgetsService,
    private viewService : ViewService
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
    gridType: 'scrollVertical',
    pushItems: true,
    resizable: {
      enabled: true,
      handles: {s: true, e: true, n: false, w: false, se: true, ne: true, sw: true, nw: true}
    },
    compactType: 'compactUp&Left',
    displayGrid: 'onDrag&Resize',
    itemChangeCallback: (item) => {this.itemChange(item); },
    itemInitCallback : (item) => {this.inited++; }
  };

widgets: Array<GridsterItem> = [];

itemChange(item) {
  item.widget.columns = item.cols;
  item.widget.rows = item.rows;
  item.widget.x = item.x;
  item.widget.y = item.y;
  if (this.widgets && this.inited === this.widgets.length) {
    this.widgetService.updateWidget(item.widget).subscribe();
  }
}

  ngOnInit(): void {
    this.viewService.currentWidgets.subscribe(
      (widgets : Widget[])=> {
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

        // this.options.api.resize();
      }
    )
  }


  removeItem(item) {
    this.widgets.splice(this.widgets.indexOf(item), 1);
  }

  addItem() {
    this.widgets.push({cols: 2, rows: 1, y: 0, x: 0});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refresh() {
    console.log('Refresh widgets!');
  }

  save() {
    // for (let widget of this.widgets) {
    //   this.widgetService.updateWidget(widget).subscribe();
    // }
    console.log('save widgets!');
  }

}




