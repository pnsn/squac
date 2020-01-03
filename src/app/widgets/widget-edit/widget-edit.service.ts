import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Metric } from 'src/app/shared/metric';
import { Threshold } from '../threshold';

@Injectable({
  providedIn: 'root'
})
export class WidgetEditService implements OnInit, OnDestroy {
  private channelGroup : ChannelGroup;
  private metrics: Metric[]
  private thresholds: { [metricId: number]: Threshold};
  private stattype;


  ngOnInit(): void {
    console.log("widget edit service created")
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  ngOnDestroy(){
    console.log("widgetEditSerovice destrotyed");
  }
  setWidget(widget : Widget) {
    if(widget) {
      this.metrics = widget.metrics;
    }

  }

}
