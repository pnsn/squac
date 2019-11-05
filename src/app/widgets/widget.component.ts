import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from './widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../shared/channel-group';
import { MeasurementsService } from './measurements.service';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from './widgets.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() dashboardId: number;
  @Input() channelGroup: ChannelGroup;
  @Input() startdate: Date;
  @Input() enddate: Date;
  @Input() editMode: boolean;
  inited = 0;
  subscription: Subscription = new Subscription();
  constructor(
    private widgetService: WidgetsService
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
    itemInitCallback : (item) => {console.log('inited', item); this.inited++; }
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
  console.log('item changed', item);
}

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    if (this.dashboardId) {
      const widgetSub = this.widgetService.getWidgetsByDashboardId(this.dashboardId).subscribe(
        (widgets: Widget[]) => {

          widgets.forEach(widget => {
            this.widgets.push({
              cols: widget.columns,
              rows: widget.rows,
              y: widget.y,
              x: widget.x,
              widget
            });
          });
          this.options.api.resize();

        }
      );

      this.subscription.add(widgetSub);
    }

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




