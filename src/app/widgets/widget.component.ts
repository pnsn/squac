import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from './widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../shared/channel-group';
import { MeasurementsService } from './measurements.service';
import { Subscription, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetsService } from './widgets.service';

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
  columnWidth = 100;
  rowHeight = 100;
  widgets : Widget[];
  constructor(
    private widgetService: WidgetsService
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.dashboardId) {
      this.widgetService.getWidgetsByDashboardId(this.dashboardId).subscribe(
        (widgets: Widget[]) => {
          this.widgets = widgets;
        }
      )
    }
  }

  ngOnDestroy(){

  }

  drop(event: CdkDragDrop<any>) {
    console.log(event)
    // moveItemInArray(
    //   widgetIds, 
    //   event.previousIndex, 
    //   event.currentIndex
    //  );

     //TODO: figure out ordering that saves
  }

  onResizeEnd(event: ResizeEvent, widget: Widget): void {
    console.log(event, widget);
    const row = Math.round(event.rectangle.height / this.rowHeight);
    const column = Math.round(event.rectangle.width / this.columnWidth);


    widget.rows = row > 0 ? row : 1;
    widget.columns = column > 0 ? column : 1;
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'))
    }, 1);
    this.widgetService.updateWidget(widget).subscribe();
  }
  
}
