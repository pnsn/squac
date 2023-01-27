import { ChannelGroup, Widget } from ".";
import { DashboardProperties, ResourceModel } from "../interfaces";
import { DASHBOARD_PROPERTIES } from "../constants";
import {
  ReadOnlyDashboardDetailSerializer,
  ReadOnlyDashboardSerializer,
  WriteOnlyDashboardSerializer,
} from "@pnsn/ngx-squacapi-client";

export interface Dashboard {
  channelGroup?: ChannelGroup;
  widgetIds?: number[];
  name: string;
  description: string;
  shareOrg: boolean;
  shareAll: boolean;
  channelGroupId?: number;
}
/**
 * Describes a dashboard
 */
export class Dashboard extends ResourceModel<
  ReadOnlyDashboardDetailSerializer | ReadOnlyDashboardSerializer | Dashboard,
  WriteOnlyDashboardSerializer
> {
  private _widgets: Widget[] = [];
  public _properties: DashboardProperties = DASHBOARD_PROPERTIES;
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

  /** @override */
  override fromRaw(
    data:
      | ReadOnlyDashboardDetailSerializer
      | ReadOnlyDashboardSerializer
      | Dashboard
  ): void {
    super.fromRaw(data);
    if ("channel_group" in data) {
      this.shareAll = data.share_all;
      this.shareOrg = data.share_org;
      this.channelGroupId = data.channel_group;
    }
  }

  /** @override */
  toJson(): WriteOnlyDashboardSerializer {
    const d: WriteOnlyDashboardSerializer = {
      name: this.name,
      description: this.description,
      share_all: this.shareAll,
      share_org: this.shareOrg,
      organization: this.organization,
      properties: JSON.stringify(this.properties),
    };
    if (this.channelGroupId) {
      d.channel_group = this.channelGroupId;
    }
    return d;
  }
}
