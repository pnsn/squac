import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { Widget } from "@features/widget/models/widget";

export class Dashboard {
  private _widgets: Array<Widget>;
  public _properties: DashboardProperties = defaultProperties;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public shareOrg: boolean,
    public shareAll: boolean,
    public orgId: number
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
}

export interface ApiPostDashboard {
  name: string;
  description: string;
  share_all: boolean;
  share_org: boolean;
  organization: number;
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
      item.organization
    );
    dashboard.properties = item.properties;
    console.log(dashboard);
    return dashboard;
  }

  adaptToApi(item: Dashboard): ApiPostDashboard {
    return {
      name: item.name,
      description: item.description,
      share_all: item.shareAll,
      share_org: item.shareOrg,
      organization: item.orgId,
      properties: JSON.stringify(item.properties),
    };
  }
}
