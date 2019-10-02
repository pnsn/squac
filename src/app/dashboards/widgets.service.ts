import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { Observable, forkJoin, empty } from 'rxjs';
import { Widget } from './widget';
import { map } from 'rxjs/operators';
import { Metric } from '../shared/metric';

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
  
  getWidgets(widgetIds: number[]) : Observable<Widget[]> {

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
            metrics
          );
          return widget;
        }
      )
    );
  }
}

