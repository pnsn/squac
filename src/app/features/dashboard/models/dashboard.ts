import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";
import { Widget } from "@widget/models/widget";

export class Dashboard {
  public widgets: Widget[];
  public starttime: string;
  public endtime: string;
  public timeRange: number;
  public archiveType: string;
  public home: boolean;
  public archiveStat: string;

  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public shareOrg: boolean,
    public shareAll: boolean,
    public orgId: number,
    public widgetIds?: number[]
  ) {}

  static get modelName() {
    return "Dashboard";
  }

  updateWidgets(widgets: Widget[]) {
    this.widgets = widgets;
    this.widgetIds = [];
    this.widgets.forEach((widget) => {
      this.widgetIds.push(widget.id);
    });
  }
}

export interface ApiGetDashboard {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  share_all: boolean;
  share_org: boolean;
  window_seconds: number;
  starttime: string;
  endtime: string;
  organization: number;
  home: boolean;
  archive_type: string;
  archive_stat: string;
  widgets?: number[];
}

export interface ApiPostDashboard {
  name: string;
  description: string;
  share_all: boolean;
  share_org: boolean;
  window_seconds: number;
  starttime: string;
  endtime: string;
  organization: number;
  home: boolean;
  archive_type: string;
  archive_stat: string;
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
      item.widgets ? item.widgets : []
    );
    if (item.window_seconds) {
      dashboard.timeRange = item.window_seconds;
    } else {
      dashboard.starttime = item.starttime;
      dashboard.endtime = item.endtime;
    }

    dashboard.archiveStat = item.archive_stat ? item.archive_stat : "min";
    dashboard.archiveType = item.archive_type ? item.archive_type : "raw";

    dashboard.home = item.home;

    return dashboard;
  }

  adaptToApi(item: Dashboard): ApiPostDashboard {
    return {
      name: item.name,
      description: item.description,
      share_all: item.shareAll,
      share_org: item.shareOrg,
      window_seconds: item.timeRange,
      starttime: item.starttime,
      endtime: item.endtime,
      organization: item.orgId,
      home: item.home,
      archive_type: item.archiveType,
      archive_stat: item.archiveStat,
    };
  }
}
