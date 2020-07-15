import { Widget } from '../../core/models/widget';
import { ChannelGroup } from '../../core/models/channel-group';

export class Dashboard {
  public widgets: Widget[];
  public starttime: string;
  public endtime: string;
  public timeRange: number;

  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public shareOrg: boolean,
    public shareAll: boolean,
    public orgId: number,
    public widgetIds?: number[]
  ) {
  }

  static get modelName() {
    return 'Dashboard';
  }

  updateWidgets(widgets: Widget[]) {
    this.widgets = widgets;
    this.widgetIds  = [];
    this.widgets.forEach(
      widget => {
        this.widgetIds.push(widget.id);
      }
    );
  }

}
