import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { Widget } from "@features/widget/models/widget";

export class Dashboard {
  private _widgets: Array<Widget>;
  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public shareOrg: boolean,
    public shareAll: boolean,
    public orgId: number,
    public properties?: DashboardProperties
  ) {
    if (!properties) {
      this.properties = { ...defaultProperties };
    }
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
    const properties = JSON.parse(item.properties);
    const dashboard = new Dashboard(
      item.id,
      +item.user_id,
      item.name,
      item.description,
      item.share_org,
      item.share_all,
      item.organization,
      properties
    );
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
