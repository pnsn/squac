import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { ChannelGroup } from "./channel-group";
import { ReadDashboard, WriteDashboard } from "../interfaces/squac-types";
import { Widget } from "./widget";
export class Dashboard {
  public channelGroup: ChannelGroup;
  private _widgets: Array<Widget> = [];
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

export interface DashboardProperties {
  timeRange?: number;
  startTime?: string;
  endTime?: string;
  archiveStat?: string;
  archiveType: string;
  autoRefresh: boolean;
}

@Injectable({
  providedIn: "root",
})
export class DashboardAdapter implements Adapter<Dashboard> {
  adaptFromApi(item: ReadDashboard): Dashboard {
    const dashboard = new Dashboard(
      item.id,
      item.user,
      item.name,
      item.description,
      item.share_org,
      item.share_all,
      item.organization,
      item.channel_group
    );

    dashboard.properties = item.properties || "";

    return dashboard;
  }

  adaptToApi(item: Dashboard): WriteDashboard {
    const d: WriteDashboard = {
      name: item.name,
      description: item.description,
      share_all: item.shareAll,
      share_org: item.shareOrg,
      organization: item.orgId,
      properties: JSON.stringify(item.properties),
    };
    if (item.channelGroupId) {
      d.channel_group = item.channelGroupId;
    }
    return d;
  }
}
