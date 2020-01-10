import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { Threshold } from '../../threshold';
import {ColumnMode, id} from '@swimlane/ngx-datatable';
import { Metric } from 'src/app/shared/metric';
import { WidgetEditService } from '../widget-edit.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-threshold-edit',
  templateUrl: './threshold-edit.component.html',
  styleUrls: ['./threshold-edit.component.scss']
})
export class ThresholdEditComponent {
  thresholds : {[metricId: number]:Threshold};
  metrics: Metric[];
  editing = {};
  rows = [];

  ColumnMode = ColumnMode;
  subscriptions: Subscription = new Subscription();
  messages = {
      // Message to show when array is presented
  // but contains no values
    emptyMessage: 'Please select metrics.',
  };

  constructor(
    private widgetEditService: WidgetEditService
  ){

  }

  ngOnInit() {
    const sub = this.widgetEditService.metrics.subscribe(metrics => {
      this.metrics = metrics;
      this.thresholds = this.widgetEditService.getThresholds();

      if(!this.thresholds) {
        this.thresholds = {};
      }

      this.rows = [];

      if(this.metrics && this.metrics.length > 0) {
        const newRows = [];
        this.metrics.forEach(
          (metric) => {
            if(this.thresholds[metric.id]) {
              newRows.push({
                "id" : +this.thresholds[metric.id].id,
                "metric" : metric,
                "min": +this.thresholds[metric.id].min,
                "max": +this.thresholds[metric.id].max
              });
            }
            else {
              console.log("row", metric)
              newRows.push({
                "id" : null,
                "metric" : metric,
                "min": null,
                "max": null
              });
            }
    
          }
        );
        this.rows = [...newRows];
      }
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    if(cell === 'metricId') {
      this.rows[rowIndex].name = this.getMetric(event.target.value);
    }
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.widgetEditService.updateThresholds(this.rows); 
  }

  getMetric(id) {
    return this.metrics.filter(metric => {
      console.log("metric", metric, id)
      return metric.id === +id;
    })[0].name;
  }



  clearThreshold() {
    console.log("thresholdDeleted")
    // this.thresholdDeleted.emit();
  }

}
