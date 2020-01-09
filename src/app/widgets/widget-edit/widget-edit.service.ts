import { Injectable} from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Metric } from 'src/app/shared/metric';
import { Threshold } from '../threshold';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetEditService {
  private widget : Widget;
  private channelGroup : ChannelGroup;
  private thresholds : { [metricId: number]: Threshold};
  private stattype;
  private editMode :boolean;

  public metrics = new BehaviorSubject<Metric[]>([]);

  //default widget dimensions
  rows = 3;
  columns = 6;
  x = 1;
  y = 1;

  constructor(){
    console.log("hiiii")
  }

  getThresholds(){
    return this.thresholds;
  }

  setWidget(widget : Widget) {
    if(widget) {
      this.widget = widget;
      this.thresholds = widget.thresholds;
      this.editMode = true;
      this.metrics.next(this.widget.metrics);
    } else {
      this.editMode = false; 
      this.thresholds = {};
      this.widget = new Widget(
        null, 
        null, 
        null, 
        null, 
        null, 
        null, 
        this.columns, 
        this.rows, 
        this.x, 
        this.y, 
        null
      )
      this.widget.thresholds = {};
    }

  }

  getWidget(){
    return this.widget;
  }

  getMetricIds() {
    return this.widget.metricsIds;
  }

  updateMetrics(metrics) {
    this.widget.metrics = metrics;
    this.metrics.next(this.widget.metrics);
  }
 
  updateThresholds(thresholds){
    thresholds.forEach(threshold => {
      this.thresholds[threshold.metric.id] = new Threshold(
        threshold.id, 
        this.widget.id, 
        threshold.metric.id,
        threshold.min, 
        threshold.max
      );
    });
    this.widget.thresholds = this.thresholds;
  }

  channelGroupChanged(){

  }

  //cancel without sacving
  clearWidget(){
    this.widget = null;
  }
  
}
