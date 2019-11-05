import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from './widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../shared/channel-group';
import { MeasurementsService } from './measurements.service';
import { Subscription, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WidgetsService } from './widgets.service';
import { preserveWhitespacesDefault } from '@angular/compiler';

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
  columnWidth = 100;
  rowHeight = 100;
  widgets : Widget[];
  subscription: Subscription = new Subscription();
  constructor(
    private widgetService: WidgetsService
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.dashboardId) {
      const widgetSub = this.widgetService.getWidgetsByDashboardId(this.dashboardId).subscribe(
        (widgets: Widget[]) => {
          this.widgets = widgets;
        }
      )
      this.subscription.add(widgetSub);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  drop(event: CdkDragDrop<any>) {
    const widget = event.item.data;
    widget.order = event.currentIndex;

    moveItemInArray(
      this.widgets, 
      event.previousIndex, 
      event.currentIndex
    );

    this.widgets.forEach(
      (widget, index) =>{
        widget.order = index;
      }
    )
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

  }

  refresh() {
    console.log("Refresh widgets!");
  }

  save(){

     //TODO: figure out ordering that saves all widgets
     // Probably just save all widgets
    for (let widget of this.widgets) {
      this.widgetService.updateWidget(widget).subscribe();
    }
    console.log("save widgets!")
  }
  
}
