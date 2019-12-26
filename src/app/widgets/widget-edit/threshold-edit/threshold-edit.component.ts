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
  @Input() thresholds: {[metricId: number]: Threshold};
  @Input() metrics: Metric[];
  @Output() thresholdAdded = new EventEmitter<Threshold>();
  @Output() thresholdDeleted = new EventEmitter<Threshold>();

  editing = {};
  rows = [];
  ColumnMode = ColumnMode;

  constructor() {

  }

  ngOnInit() {
  }

  addThreshold() {
    console.log('add threshold');

    // this.thresholdAdded.emit();
  }

  deleteThreshold() {
    console.log('thresholdDeleted');
    // this.thresholdDeleted.emit();
  }

}
