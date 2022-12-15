import { Injectable } from "@angular/core";
import { ChannelGroup, Widget } from "../models";
import {
  Adapter,
  ReadDashboard,
  WriteDashboard,
  DashboardProperties,
} from "../interfaces";
import { DASHBOARD_PROPERTIES } from "../constants";
/**
 *
 */
export class Dashboard {
  public channelGroup?: ChannelGroup;
  private _widgets: Widget[] = [];
  public _properties: DashboardProperties = DASHBOARD_PROPERTIES;
  widgetIds?: number[];
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
  /**
   *
   */
  public set properties(properties: string | Partial<DashboardProperties>) {
    let props: Partial<DashboardProperties> = {};
    if (!properties) {
      props = DASHBOARD_PROPERTIES;
    } else if (properties && typeof properties === "string") {
      try {
        props = { ...(JSON.parse(properties) as Record<string, unknown>) };
      } catch {
        return;
      }
    } else if (typeof properties !== "string") {
      props = { ...properties };
    }
    this._properties = { ...this._properties, ...props };
  }

  /**
   *
   */
  public get properties(): DashboardProperties {
    return this._properties;
  }

  /**
   *
   */
  public get widgets(): Widget[] {
    return this._widgets;
  }

  /**
   *
   */
  public set widgets(widgets: Widget[]) {
    this._widgets = widgets;
    this.widgetIds = widgets.map((w) => {
      return w.id;
    });
  }

  /**
   *
   */
  static get modelName(): string {
    return "Dashboard";
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class DashboardAdapter
  implements Adapter<Dashboard, ReadDashboard, WriteDashboard>
{
  /**
   *
   * @param item
   */
  adaptFromApi(item: ReadDashboard): Dashboard {
    const dashboard = new Dashboard(
      item.id ? +item.id : 0,
      item.user ? +item.user : 0,
      item.name,
      item.description ?? "",
      item.share_org ?? false,
      item.share_all ?? false,
      item.organization,
      item.channel_group
    );

    dashboard.properties = item.properties ?? "";

    return dashboard;
  }

  /**
   *
   * @param item
   */
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
