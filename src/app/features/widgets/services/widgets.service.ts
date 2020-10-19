import { Injectable, EventEmitter } from '@angular/core';
import { Observable, forkJoin, empty, EMPTY, of } from 'rxjs';
import { Widget } from '@features/widgets/models/widget';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { SquacApiService } from '@core/services/squacapi.service';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { ChannelGroup } from '@core/models/channel-group';
import { Threshold } from '../models/threshold';
import { Metric } from '@core/models/metric';
import { ViewService } from '@core/services/view.service';



interface WidgetHttpData {
  name: string;
  description: string;
  metrics: number[];
  dashboard: number;
  widgettype: number;
  stattype: number;
  columns: number;
  rows: number;
  x_position: number;
  y_position: number;
  channel_group: number;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
// Class for widget interaction with squac
export class WidgetsService {

  private url = 'dashboard/widgets/';

  constructor(
    private squacApi: SquacApiService,
    private channelGroupsService: ChannelGroupsService
  ) {
  }

  widgetUpdated = new EventEmitter<number>();

  getWidgets(dashboardId: number): Observable<Widget[]> {
    const widgets: Widget[] = [];
    return this.squacApi.get(this.url, null,
      {
        dashboard : dashboardId
      }
      ).pipe(
        switchMap(
          response => {
            let cGRequests = [];
            response.forEach(w => {
              widgets.push(this.mapWidget(w));
              if (cGRequests.indexOf(w.channel_group) < 0) {
                cGRequests.push(w.channel_group);
              }
            });

            cGRequests = cGRequests.map(id => {
              return this.channelGroupsService.getChannelGroup(id);
            });
            return cGRequests.length > 0 ? forkJoin(cGRequests) : of([]);
          }
        ),
        tap(
          response => {
            console.log(response)
          }
        ),
        map(
          (channelGroups: any) => {
            widgets.forEach(w => {
              w.channelGroup = channelGroups.find((cg: ChannelGroup) => {
                return cg.id === w.channelGroupId;
              });
            });
            return widgets;
          }
        )
      );
  }

  getWidget(id: number): Observable<Widget> {
    let widget: Widget;
    return this.squacApi.get(this.url, id).pipe(
      switchMap(response => {
        widget = this.mapWidget(response);
        return this.channelGroupsService.getChannelGroup(widget.channelGroupId);
      }),
      map(channelGroup => {
        widget.channelGroup = channelGroup;
        return widget;
      })
    );
  }

  private mapWidget(response: any): Widget {
    const metrics = [];
    const thresholds = {};
    if (response.thresholds) {
      response.thresholds.forEach(t => {
        const threshold = new Threshold (
          t.id,
          t.user_id,
          t.widget,
          t.metric,
          t.minval,
          t.maxval
        );
        thresholds[t.metric] = threshold;
      });


    }

    if (response.metrics) {
      response.metrics.forEach(m => {
        const metric = new Metric(
          m.id,
          m.user_id,
          m.name,
          m.code,
          m.description,
          m.url,
          m.unit,
          m.default_minval,
          m.default_maxval
        );
        metrics.push( metric );
      });
    }

    const widget = new Widget(
      response.id,
      response.user_id,
      response.name,
      response.description,
      response.widgettype.id,
      response.dashboard.id,
      response.channel_group,
      response.columns,
      response.rows,
      response.x_position,
      response.y_position,
      metrics
    );
    widget.thresholds = thresholds;
    widget.stattype = response.stattype;
    widget.type = response.widgettype.type;

    return widget;

  }

  //Post and put for widget don't return serialized values
  updateWidget(widget: Widget): Observable<any> {
    const postData: WidgetHttpData = {
      name: widget.name,
      description: widget.description,
      metrics: widget.metricsIds,
      widgettype: widget.typeId,
      dashboard: widget.dashboardId,
      columns: widget.columns,
      rows: widget.rows,
      x_position: widget.x,
      y_position: widget.y,
      channel_group: widget.channelGroupId,
      stattype: widget.stattype ? widget.stattype.id : 1
    };
    if (widget.id) {
      postData.id = widget.id;
      return this.squacApi.put(this.url, widget.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteWidget(widgetId): Observable<any> {
    return this.squacApi.delete(this.url, widgetId);
  }

}

