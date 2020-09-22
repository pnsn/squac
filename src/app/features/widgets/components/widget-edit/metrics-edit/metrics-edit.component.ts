import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { Metric } from '@core/models/metric';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { WidgetEditService } from '../../../services/widget-edit.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit, OnDestroy {
  @Input('metrics') metrics : Metric[];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  subscriptions: Subscription = new Subscription();
  loading = false;
  availableMetrics: Metric[] = [];
  selectedMetrics: Metric[] = [];
  tableRows: Metric[];

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
    private metricsService: MetricsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.availableMetrics = this.metrics;
    this.tableRows = this.availableMetrics;
    const metricIds = this.widgetEditService.getMetricIds();
    if (metricIds && metricIds.length > 0) {
      this.selectedMetrics = this.availableMetrics.filter(
        metric => {
          return metricIds.indexOf(metric.id) >= 0;
        }
      );
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  metricsSelected({selected}) {
    this.selectedMetrics.splice(0, this.selectedMetrics.length);
    this.selectedMetrics.push(...selected);


    this.widgetEditService.updateMetrics(this.selectedMetrics);
    // this.selectedMetrics = event;
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
