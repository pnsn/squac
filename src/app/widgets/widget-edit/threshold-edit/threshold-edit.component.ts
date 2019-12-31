import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Threshold } from '../../threshold';
import {ColumnMode} from '@swimlane/ngx-datatable';
import { Metric } from 'src/app/shared/metric';
@Component({
  selector: 'app-threshold-edit',
  templateUrl: './threshold-edit.component.html',
  styleUrls: ['./threshold-edit.component.scss']
})
export class ThresholdEditComponent implements OnInit {
  @Input() thresholds : {[metricId: number]:Threshold};
  @Input() metrics: Metric[];
  @Output() thresholdAdded = new EventEmitter<Threshold>();
  @Output() thresholdDeleted = new EventEmitter<Threshold>();
  editing = {};
  rows = [];

  ColumnMode = ColumnMode;

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + "-" + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  ngOnInit() {
    this.metrics.forEach(
      (metric) => {
        if(this.thresholds[metric.id]) {
          this.rows.push(this.thresholds[metric.id]);
        }

      }
    );
    console.log(this.rows)
  }

  addThreshold() {
    console.log("add threshold");
    const index = this.rows.length;
    this.rows.push(new Threshold(
      null,
      null,
      null,
      null,
      null
    ));
    this.rows = [...this.rows];
    this.editing[index + "-metricId"] = true;
    this.editing[index + "-min"] = true;
    this.editing[index + "-max"] = true;
    // this.thresholdAdded.emit();
  }

  deleteThreshold() {
    console.log("thresholdDeleted")
    // this.thresholdDeleted.emit();
  }

}
