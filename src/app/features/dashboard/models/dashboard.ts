import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { ChannelGroup } from "@core/models/channel-group";
import { Widget } from "@features/widget/models/widget";

export class Dashboard {
  public channelGroup: ChannelGroup;
  private _widgets: Array<Widget>;
  public _properties: DashboardProperties = defaultProperties;
  widgetIds: Array<number>;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public shareOrg: boolean,
    public shareAll: boolean,
    public orgId: number,
    public channelGroupId?: number
  ) {}

  //can be entered as string or properties
  public set properties(properties: string | Partial<DashboardProperties>) {
    let props: Partial<DashboardProperties>;
    if (!properties) {
      props = defaultProperties;
    } else if (properties && typeof properties === "string") {
      props = { ...JSON.parse(properties) };
    } else if (typeof properties !== "string") {
      props = { ...properties };
    }
    this._properties = { ...this._properties, ...props };
  }

  public get properties(): DashboardProperties {
    return this._properties;
  }

  public get widgets(): Array<Widget> {
    return this._widgets;
  }

  public set widgets(widgets: Array<Widget>) {
    this._widgets = widgets;
    this.widgetIds = widgets.map((w) => {
      return w.id;
    });
  }

  static get modelName() {
    return "Dashboard";
  }
}

const defaultProperties: DashboardProperties = {
  timeRange: 3600,
  archiveType: "raw",
  autoRefresh: true,
};

export interface ApiGetDashboard {
  id: number;
  name: string;
  description: string;
  user_id: string;
  share_all: boolean;
  share_org: boolean;
  organization: number;
  properties: string;
  widgets?: number[];
  starttime?: string;
  endtime?: string;
  archive_type?: string;
  window_seconds?: number;
  channel_group?: number;
}

export interface ApiPostDashboard {
  name: string;
  description: string;
  share_all: boolean;
  share_org: boolean;
  organization: number;
  channel_group: number;
  properties: string;
}

export interface DashboardProperties {
  timeRange?: number;
  startTime?: string;
  endTime?: string;
  archiveStat?: string;
  archiveType: string;
  autoRefresh: boolean;
}

export function populateProperties(item: ApiGetDashboard): string {
  const properties: DashboardProperties = {
    timeRange: item.window_seconds,
    startTime: item.starttime,
    endTime: item.endtime,
    archiveType: item.archive_type,
    archiveStat: item.archive_type ? "raw" : null,
    autoRefresh: !!item.window_seconds,
  };

  return JSON.stringify(properties);
}

@Injectable({
  providedIn: "root",
})
export class DashboardAdapter implements Adapter<Dashboard> {
  adaptFromApi(item: ApiGetDashboard): Dashboard {
    const dashboard = new Dashboard(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.share_org,
      item.share_all,
      item.organization,
      item.channel_group
    );

    dashboard.widgetIds = item.widgets;

    if (!item.properties) {
      dashboard.properties = populateProperties(item);
    } else {
      dashboard.properties = item.properties;
    }
    return dashboard;
  }

  adaptToApi(item: Dashboard): ApiPostDashboard {
    return {
      name: item.name,
      description: item.description,
      share_all: item.shareAll,
      share_org: item.shareOrg,
      organization: item.orgId,
      channel_group: item.channelGroupId,
      properties: JSON.stringify(item.properties),
    };
  }
}
