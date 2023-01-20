import { ChannelGroup, Widget } from ".";
import {
  ReadDashboard,
  WriteDashboard,
  DashboardProperties,
} from "../interfaces";
import { DASHBOARD_PROPERTIES } from "../constants";

/**
 * Describes a dashboard
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

  /**
   * stores dashboard properties
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
   * @returns dashboard properties
   */
  public get properties(): DashboardProperties {
    return this._properties;
  }

  /**
   * @returns dashboard widgets
   */
  public get widgets(): Widget[] {
    return this._widgets;
  }

  /**
   * updates dashboard widgets
   */
  public set widgets(widgets: Widget[]) {
    this._widgets = widgets;
    this.widgetIds = widgets.map((w) => {
      return w.id;
    });
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Dashboard";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadDashboard): Dashboard {
    const dashboard = new Dashboard(
      item.id ? +item.id : 0,
      item.user ? +item.user : 0,
      item.name,
      item.description ?? "",
      item.shareOrg ?? false,
      item.shareAll ?? false,
      item.organization,
      item.channelGroup
    );

    dashboard.properties = item.properties ?? "";

    return dashboard;
  }

  /**
   *
   */
  serialize(): WriteDashboard {
    const d: WriteDashboard = {
      name: this.name,
      description: this.description,
      shareAll: this.shareAll,
      shareOrg: this.shareOrg,
      organization: this.orgId,
      properties: JSON.stringify(this.properties),
    };
    if (this.channelGroupId) {
      d.channelGroup = this.channelGroupId;
    }
    return d;
  }
}
