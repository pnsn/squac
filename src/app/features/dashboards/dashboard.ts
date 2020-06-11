import { Widget } from '../widgets/widget';
import { ChannelGroup } from '../shared/channel-group';

export class Dashboard {
  public widgets: Widget[];
  public startdate: Date;
  public enddate: Date;

  constructor(
    public id: number,
    public owner: number,
    public name: string,
    public description: string,
    public isPublic: boolean,
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
