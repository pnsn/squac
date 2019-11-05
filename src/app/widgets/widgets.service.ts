import { Injectable, EventEmitter } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { Observable, forkJoin, empty, EMPTY } from 'rxjs';
import { Widget } from './widget';
import { map } from 'rxjs/operators';
import { Metric } from '../shared/metric';
import { Threshold } from './threshold';


interface WidgetHttpData {
  name: string;
  description: string;
  metrics: string[];
  dashboard: number;
  widgettype: number;
  stattype: number;
  columns: number;
  rows: number;
  order: number;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
// Class for widget interaction with squac
export class WidgetsService {

  private url = 'dashboard/widgets/';

  constructor(
    private squacApi: SquacApiService
  ) {
  }

  widgetUpdated = new EventEmitter<number>();
  
  getWidgets(widgetIds: number[]): Observable<Widget[]> {

    const widgetRequests = widgetIds.map(id => {
      return this.getWidget(id);
    });

    return forkJoin(widgetRequests);
  }

  getWidget(id: number): Observable<Widget> {
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          const metrics = [];
          const thresholds = {};
          response.thresholds.forEach(t => {
            const threshold = new Threshold (
              t.id,
              t.widget, 
              t.metric, 
              t.minval,
              t.maxval
            );
            thresholds[t.metric] = threshold;
          })

          response.metrics.forEach(m => {
            const metric = new Metric(
              m.id,
              m.name,
              m.description,
              m.url,
              m.unit
            );
            if(thresholds[m.id]) {
              metric.threshold = thresholds[m.id];
            }
            metrics.push( metric );
          });

          const widget = new Widget(
            response.id,
            response.name,
            response.description,
            response.widgettype.id,
            response.dashboard.id,
            response.columns,
            response.rows,
            response.order,
            metrics
          );

          widget.type = response.widgettype.type;

          return widget;
        }
      )
    );
  }

  updateWidget(widget: Widget) {

    const postData: WidgetHttpData = {
      name: widget.name,
      description: widget.description,
      metrics: widget.metricsIds,
      widgettype: widget.typeId,
      dashboard: widget.dashboardId,
      columns: widget.columns,
      rows: widget.rows,
      order: widget.order,
      stattype: 1
    };
    if (widget.id) {
      postData.id = widget.id;
      return this.squacApi.put(this.url, widget.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

}

