import {
  Component,
  ViewChild,
  OnDestroy,
  TemplateRef,
  OnInit,
} from "@angular/core";
import {
  ColumnMode,
  SelectionType,
  SortType,
} from "@boring.devs/ngx-datatable";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { GenericWidgetComponent } from "../abstract-components";

@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
})
export class TabularComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  @ViewChild("dataTable") table: any;
  @ViewChild("cellTemplate") cellTemplate: TemplateRef<any>;
  @ViewChild("headerTemplate") headerTemplate: TemplateRef<any>;

  emphasizedChannel: string;
  deemphasizedChannel: string;

  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;
  rows = [];
  columns = [];
  selectedRow = [];

  messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: "Loading data.",

    // Footer total message
    totalMessage: "total",

    // Footer selected message
    selectedMessage: "selected",
  };
  sorts;
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }
  override ngOnInit(): void {
    this.subscription.add(
      this.widgetManager.resize$.subscribe(this.resize.bind(this))
    );
    super.ngOnInit();
  }

  startZoom(): void {
    return;
  }
  toggleKey(): void {
    return;
  }

  changeMetrics(): void {
    let name;
    let isTreeColumn;
    switch (this.properties.displayType) {
      case "channel":
        name = "Channel";
        isTreeColumn = false;
        break;
      case "stoplight":
        name = "Station";
        isTreeColumn = true;
        break;
      default:
        name = "Station";
        isTreeColumn = true;
        break;
    }

    this.columns = [
      {
        name,
        prop: "title",
        isTreeColumn,
        width: 100,
        canAutoResize: false,
        frozenLeft: true,
        resizeable: true,
        comparator: this.channelComparator.bind(this),
      },
    ];

    this.columns.push({
      name: "# out",
      prop: "agg",
      width: 45,
      canAutoResize: false,
      frozenLeft: true,
      resizeable: false,
    });
    this.sorts = [{ prop: "agg", dir: "desc" }];
    setTimeout(() => {
      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;
        this.columns.push({
          name: metric.name,
          prop: metric.id,
          comparator: this.metricComparator.bind(this),
          width: 65,
          canAutoResize: true,
          sortable: true,
          cellTemplate: this.cellTemplate,
          headerTemplate: this.headerTemplate,
        });
      });
      this.columns = [...this.columns];
    }, 0);
  }

  deemphasizeChannel(channel: string): void {
    this.deemphasizedChannel = channel;
  }

  emphasizeChannel(channel: string): void {
    const index = this.findRowIndex(channel);
    const row = this.rows[index];
    this.emphasizedChannel = channel;
    this.selectedRow = [row];
    this.table.element.querySelector(".datatable-body").scrollTop =
      index * this.table.rowHeight;
  }

  configureChart(): void {
    return;
  }

  resize() {
    if (this.table) {
      this.table.recalculate();
    }
  }

  private findRowIndex(nslc) {
    return this.rows.findIndex((row) => {
      return row.nslc === nslc;
    });
  }

  private metricComparator(propA, propB) {
    const result = propA.value - propB.value;
    return result;
  }

  private channelComparator(propA, propB) {
    return propA.localeCompare(propB);
  }

  buildChartData(data) {
    return new Promise<void>((resolve) => {
      const rows = [];
      const stations = [];
      const stationRows = [];

      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        3
      );

      this.channels.forEach((channel) => {
        const identifier = channel.staCode;
        const nslc = channel.nslc;
        let agg = 0;
        const rowMetrics = {};
        const stationRowMetrics = {};
        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          let val: number = null;
          let count;

          if (data.get(channel.id)) {
            const rowData = data.get(channel.id).get(metric.id);
            val = rowData && rowData[0] ? rowData[0].value : null;
          }

          const visualMap = this.visualMaps[metric.id];
          const inRange = visualMap
            ? this.widgetConfigService.checkValue(val, visualMap)
            : true;
          if (val === null || (visualMap && !inRange)) {
            agg++;
            count = 0;
          } else {
            count = 1;
          }

          rowMetrics[metric.id] = {
            value: val,
            color: this.getStyle(val, visualMap),
            count: 0,
          };
          stationRowMetrics[metric.id] = {
            value: val,
            color: this.getStyle(val, visualMap),
            count, //channel in range for this metric
          };
        });
        let title;
        if (this.properties.displayType === "channel") {
          title = nslc;
        } else {
          title = channel.loc + "." + channel.code;
        }

        let row = {
          title,
          id: channel.id,
          nslc: nslc,
          parentId: identifier,
          treeStatus: "disabled",
          agg,
        };
        row = { ...row, ...rowMetrics };
        rows.push(row);

        if (this.properties.displayType !== "channel") {
          let staIndex = stations.indexOf(identifier);
          if (staIndex < 0) {
            staIndex = stations.length;
            stations.push(identifier);
            const station = {
              ...{
                title: identifier,
                id: identifier,
                treeStatus: "collapsed",
                count: 0, //number of channels the station has
                agg, //number of channels/metrics out of spec
                type: this.properties.displayType,
              },
            };

            stationRows.push(station);
          }
          stationRows[staIndex] = this.findWorstChannel(
            row,
            stationRows[staIndex],
            stationRowMetrics
          );
          // check if agg if worse than current agg
        }
      });
      this.rows = [...stationRows, ...rows];
      resolve();
    });
  }

  //FIXME: this needs to be cleaned up
  private findWorstChannel(channel, station, stationRowMetrics) {
    station.count++;
    if (station.type === "worst") {
      if (channel.agg >= station.agg) {
        const newStation = { ...station, ...stationRowMetrics };
        newStation.treeStatus = station.treeStatus;
        newStation.id = station.id;
        newStation.parentId = null;
        return newStation;
      }
    } else if (station.type === "stoplight") {
      Object.keys(stationRowMetrics).forEach((key) => {
        if (!station[key]) {
          station[key] = { ...stationRowMetrics[key] };
        } else {
          station[key].count += stationRowMetrics[key].count;
        }

        if (station[key].count === station.count) {
          //all in
          station[key].color = this.visualMaps[key]?.colors.in;
        } else if (station[key].count > 0) {
          //some out
          station[key].color = this.visualMaps[key]?.colors.middle;
        } else if (station[key].count === 0) {
          // all out
          station[key].color = this.visualMaps[key]?.colors.out;
        }

        if (!station[key].color) {
          station[key].color = "gray";
        }
      });
    }
    return station;
  }

  onTreeAction(event: any) {
    // const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === "collapsed") {
      row.treeStatus = "loading";
      row.treeStatus = "expanded";
      this.rows = [...this.rows];
    } else {
      row.treeStatus = "collapsed";
      this.rows = [...this.rows];
    }
  }

  onSelect(event) {
    this.onTreeAction({ row: event.selected[0] });
  }

  getRowClass(row) {
    const temp = {
      deemphasized: row.nslc === this.deemphasizedChannel,
      emphasized: row.nslc === this.emphasizedChannel,
    };
    return temp;
  }

  private getStyle(value, visualMap): string {
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }
}
