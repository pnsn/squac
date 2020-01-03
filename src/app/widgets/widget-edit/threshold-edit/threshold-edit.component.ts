import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Threshold } from '../../threshold';
import {ColumnMode, id} from '@swimlane/ngx-datatable';
import { Metric } from 'src/app/shared/metric';
@Component({
  selector: 'app-threshold-edit',
  templateUrl: './threshold-edit.component.html',
  styleUrls: ['./threshold-edit.component.scss']
})
export class ThresholdEditComponent implements OnInit {
  @Input() thresholds : {[metricId: number]:Threshold};
  @Input() metrics: Metric[];
  @Output() thresholdsChanged = new EventEmitter<any[]>();
  editing = {};
  rows = [];

  ColumnMode = ColumnMode;

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    if(cell === 'metricId') {
      this.rows[rowIndex].name = this.getMetric(event.target.value);
    }
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.thresholdsChanged.emit(this.rows);
  }

  getMetric(id) {
    return this.metrics.filter(metric => {
      console.log(metric, id)
      return metric.id === +id;
    })[0].name;
  }

  ngOnInit() {
    console.log(this.metrics)
    if(this.metrics) {
      this.metrics.forEach(
        (metric) => {
          if(this.thresholds[metric.id]) {
            this.rows.push({
              "id" : this.thresholds[metric.id].id,
              "metric" : metric,
              "min": this.thresholds[metric.id].min,
              "max": this.thresholds[metric.id].max
            });
          }
          else {
            this.rows.push({
              "id" : null,
              "metric" : metric,
              "min": null,
              "max": null
            });
          }
  
        }
      );
    }
  }

  clearThreshold() {
    console.log("thresholdDeleted")
    // this.thresholdDeleted.emit();
  }

}
