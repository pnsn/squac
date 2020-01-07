import { Component, OnInit } from '@angular/core';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit {
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  constructor() { }

  ngOnInit() {
  }

}
