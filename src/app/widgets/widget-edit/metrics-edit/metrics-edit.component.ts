import { Component, OnInit } from '@angular/core';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { Metric } from 'src/app/shared/metric';
import { MetricsService } from 'src/app/shared/metrics.service';
import { WidgetEditService } from '../widget-edit.service';
import { Subscription } from 'rxjs';
import { Widget } from '../../widget';
@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit {
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  subscriptions: Subscription = new Subscription();

  availableMetrics: Metric[] = [];
  selectedMetrics: Metric[] = [];
  tableRows: Metric[];

  constructor(
    private metricsService: MetricsService,
    private widgetEditService: WidgetEditService
  ) { }

  ngOnInit() {
    const sub1 = this.metricsService.getMetrics.subscribe(metrics => {
      this.availableMetrics = metrics;
      this.tableRows = this.availableMetrics;

      const metricIds = this.widgetEditService.getMetricIds();
      console.log(metricIds)
      if(metricIds.length > 0) {
        this.selectedMetrics = this.availableMetrics.filter(
          metric => {
            return metricIds.indexOf(metric.id) >= 0;
          }
        );
        console.log(this.selectedMetrics)
      }
    });


    this.subscriptions.add(sub1);

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
