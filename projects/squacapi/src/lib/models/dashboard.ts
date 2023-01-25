import { ChannelGroup, Widget } from ".";
import {
  ReadDashboard,
  WriteDashboard,
  DashboardProperties,
  ResourceModel,
} from "../interfaces";
import { DASHBOARD_PROPERTIES } from "../constants";
import { WriteOnlyDashboardSerializer } from "@pnsn/ngx-squacapi-client";

/**
 * Describes a dashboard
 */
export class Dashboard extends ResourceModel<ReadDashboard, WriteDashboard> {
  public channelGroup?: ChannelGroup;
  private _widgets: Widget[] = [];
  public _properties: DashboardProperties = DASHBOARD_PROPERTIES;
  widgetIds?: number[];

  owner: number;
  name: string;
  description: string;
  shareOrg: boolean;
  shareAll: boolean;
  orgId: number;
  channelGroupId?: number;

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

  fromRaw(data: ReadDashboard): void {
    Object.assign(this, {
      id: data.id,
      owner: data.user,
      name: data.name,
      description: data.description,
      shareAll: data.share_all,
      shareOrg: data.share_org,
      orgId: data.organization,
      channelGroupId: data.channel_group,
    });

    this.properties = data.properties;
  }

  toJson(): WriteOnlyDashboardSerializer {
    const d: WriteDashboard = {
      name: this.name,
      description: this.description,
      share_all: this.shareAll,
      share_org: this.shareOrg,
      organization: this.orgId,
      properties: JSON.stringify(this.properties),
    };
    if (this.channelGroupId) {
      d.channel_group = this.channelGroupId;
    }
    return d;
  }
}
