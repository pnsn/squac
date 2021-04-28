import { ApiGetDashboard, Dashboard } from '@features/dashboards/models/dashboard';
import { ApiGetThreshold, Threshold, ThresholdAdapter } from '@features/widgets/models/threshold';
import { ChannelGroup } from '@core/models/channel-group';
import { ApiGetMetric, Metric, MetricAdapter } from '@core/models/metric';
import { Adapter } from '@core/models/adapter';

export class Widget {
  public type: string;
  public channelGroup: ChannelGroup;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public typeId: number,
    public dashboardId: number,
    public channelGroupId: number,
    public columns: number,
    public rows: number,
    public x: number,
    public y: number,
    public metrics: Metric[]
  ) {

  }
  public stattype;
  public thresholds: { [metricId: number]: Threshold};
  // get ids from the channels
  get metricsIds(): number[] {
    const array = [];
    if (this.metrics) {
      this.metrics.forEach(metric => {
        array.push(metric.id);
      });
    }

    return array;
  }

  get metricsString(): string {
    return this.metricsIds.toString();
  }
}

export interface ApiGetWidget {
  id: number;
  name: string;
  dashboard: ApiGetDashboard;
  description: string;
  widgettype
  metrics: ApiGetMetric[];
  created_at: string;
  updated_at: string;
  thresholds: ApiGetThreshold[];
  columns: number;
  rows: number;
  x_position: number;
  y_position: number;
  stattype: any;
  channel_group: number;
  user_id: string;
  color_pallet: string;
}

export interface ApiPostWidget {
  name: string;
  dashboard: number;
  widgettype: number;
  description: string;
  metrics: number[];
  stattype: number;
  columns: number;
  rows: number;
  x_position: number;
  y_position: number;
  channel_group: number;
  color_pallet: string;
}

export class WidgetAdapter implements Adapter<Widget> {
  constructor(
    private metricAdapter: MetricAdapter,
    private thresholdsAdapter: ThresholdAdapter
  ) {}
  adaptFromApi(item: ApiGetWidget): Widget {
    const metrics = [];
    const thresholds = [];

    if (item.metrics) {
      item.metrics.forEach(m => {
        metrics.push( this.metricAdapter.adaptFromApi(m) );
      });
    }

    if(item.thresholds) {
      item.thresholds.forEach(t => {
        thresholds.push( this.thresholdsAdapter.adaptFromApi(t) );
      })
    }
    const widget = new Widget(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.widgettype.id,
      item.dashboard.id,
      item.channel_group,
      item.columns,
      item.rows,
      item.x_position,
      item.y_position,
      metrics
    );
    widget.thresholds = thresholds;
    widget.stattype = item.stattype;
    widget.type = item.widgettype.type;
    return widget;
  }

  adaptToApi(item: Widget) : ApiPostWidget {
    return {
      name: item.name,
      description: item.description,
      metrics: item.metricsIds,
      widgettype: item.typeId,
      dashboard: item.dashboardId,
      columns: item.columns,
      rows: item.rows,
      x_position: item.x,
      y_position: item.y,
      channel_group: item.channelGroupId,
      stattype: item.stattype ? item.stattype.id : 1,
      color_pallet: "squac"
    }
  }
}