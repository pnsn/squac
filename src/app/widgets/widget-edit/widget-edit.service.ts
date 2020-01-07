import { Injectable} from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Metric } from 'src/app/shared/metric';
import { Threshold } from '../threshold';

@Injectable({
  providedIn: 'root'
})
export class WidgetEditService {
  private widget;
  private channelGroup : ChannelGroup;
  private metrics: Metric[]
  private thresholds: { [metricId: number]: Threshold};
  private stattype;

  constructor(){
    console.log("hiiii")
  }

  setWidget(widget : Widget) {
    if(widget) {
      this.metrics = widget.metrics;
      this.channelGroup = widget.channelGroup;
      this.thresholds = widget.thresholds;
      console.log(this.metrics)
    }

  }
  metricsChanged(){

  }

  thresholdsChanged(){

  }

  channelGroupChanged(){

  }

  //cancel without sacving
  clearWidget(){
    this.widget = null;
  }
  
}
