import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { Observable, forkJoin, empty } from 'rxjs';
import { Widget } from './widget';
import { map } from 'rxjs/operators';
import { Metric } from '../shared/metric';


interface WidgetHttpData {
  name: string;
  description: string;
  metrics: string[];
  dashboard: number;
  widgettype: number;
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
          response.metrics.forEach(m => {
            const metric = new Metric(
              m.id,
              m.name,
              m.description,
              m.url,
              m.unit
            );
            metrics.push( metric );
          });

          const widget = new Widget(
            response.id,
            response.name,
            response.widgettype.id,
            response.dashboard.id,
            metrics
          );

          widget.type = response.widgettype.type;

          return widget;
        }
      )
    );
  }

  updateWidget(widget: Widget): Observable<Widget> {
    const postData: WidgetHttpData = {
      name: widget.name,
      description: widget.description,
      metrics: widget.metricsIds,
      widgettype: widget.typeId,
      dashboard: widget.dashboardId
    };
    if (widget.id) {
      postData.id = widget.id;
      return this.squacApi.put(this.url, widget.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

}

