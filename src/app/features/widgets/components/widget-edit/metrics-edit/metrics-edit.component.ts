import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { Metric } from '@core/models/metric';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { WidgetEditService } from '../../../services/widget-edit.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() metrics: Metric[];
  @ViewChild('metricTable') metricTable;
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  subscriptions: Subscription = new Subscription();
  loading = false;
  availableMetrics: Metric[] = [];
  selectedMetrics: Metric[] = [];
  tableRows: Metric[];
  done : boolean = false;
  messages = {
      // Message to show when array is presented
  // but contains no values
    emptyMessage: 'Loading data.',

    // Footer total message
    totalMessage: 'total',

    // Footer selected message
    selectedMessage: 'selected'
};

  constructor(
    private widgetEditService: WidgetEditService
  ) { }

  ngOnInit() {
    this.availableMetrics = this.metrics;
    this.tableRows = this.availableMetrics;
    const metricIds = this.widgetEditService.getMetricIds();
    if (metricIds && metricIds.length > 0) {
      this.done = true;
      this.selectedMetrics = this.availableMetrics.filter(
        metric => {
          return metricIds.indexOf(metric.id) >= 0;
        }
      );
    }
    this.checkValid();
  }

  ngAfterViewInit(): void {
    if (this.availableMetrics) {
      this.availableMetrics = [...this.availableMetrics];
      this.metricTable.recalculate();
    }

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  metricsSelected({selected}) {
    this.selectedMetrics.splice(0, this.selectedMetrics.length);
    this.selectedMetrics.push(...selected);
    this.checkValid();
    
    this.widgetEditService.updateMetrics(this.selectedMetrics);
    // this.selectedMetrics = event;
  }

  checkValid() {
    this.done = this.selectedMetrics && this.selectedMetrics.length > 0;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.availableMetrics.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tableRows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
