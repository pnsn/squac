import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  TemplateRef,
} from "@angular/core";
import { ColumnMode, SortType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@widget/models/threshold";
import { Channel } from "@core/models/channel";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";

@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
  providers: [WidgetTypeService],
})
export class TabularComponent
  implements OnInit, OnDestroy, OnChanges, WidgetTypeComponent
{
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  subscription = new Subscription();
  visualMaps;

  @ViewChild("dataTable") table: any;
  @ViewChild("cellTemplate") cellTemplate: TemplateRef<any>;
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
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
  groupByStation = true;
  constructor(private widgetTypeService: WidgetTypeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // (changes.data || changes.selectedMetrics) &&
    // this.channels.length > 0 &&
    // this.selectedMetrics.length > 0
    if (changes.data && this.channels.length > 0) {
      this.buildRows(this.data);
    }
  }

  ngOnInit() {
    this.columns = [
      {
        name: "Channel",
        prop: "title",
        isTreeColumn: this.groupByStation,
        width: 150,
        canAutoResize: false,
        frozenLeft: true,
        resizeable: false,
        comparator: this.channelComparator.bind(this),
      },
    ];

    this.columns.push({
      name: "# out",
      prop: "agg",
      width: 60,
      canAutoResize: false,
      frozenLeft: true,
      resizeable: false,
    });
    this.sorts = [{ prop: "agg", dir: "desc" }];
    setTimeout(() => {
      this.selectedMetrics.forEach((metric) => {
        this.columns.push({
          name: metric.name,
          prop: metric.id,
          comparator: this.metricComparator.bind(this),
          width: 100,
          canAutoResize: false,
          sortable: true,
          cellTemplate: this.cellTemplate,
        });
      });
      this.columns = [...this.columns];
    }, 0);

    this.buildRows(this.data);
  }

  private metricComparator(propA, propB) {
    const result = propA.value - propB.value;
    return result;
  }

  private channelComparator(propA, propB) {
    return propA.localeCompare(propB);
  }

  private findWorstChannel(channel, station) {
    if (channel.agg > station.agg) {
      const newStation = { ...channel };
      newStation.treeStatus = station.treeStatus;
      newStation.id = station.id;
      newStation.parentId = null;
      return newStation;
    }
    return station;
  }

  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.dataRange,
      3
    );

    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + "." + channel.stationCode;

      let agg = 0;
      const rowMetrics = {};

      this.selectedMetrics.forEach((metric) => {
        let val: number = null;

        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }

        const visualMap = this.visualMaps[metric.id];
        const inRange =
          visualMap && val <= visualMap.max && val >= visualMap.min;

        if (visualMap && val != null && !inRange) {
          agg++;
        }

        rowMetrics[metric.id] = {
          value: val,
          color: this.getStyle(val, visualMap),
        };
      });
      const title =
        channel.networkCode +
        "." +
        channel.stationCode +
        "." +
        channel.loc +
        "." +
        channel.code;
      let row = {
        title,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: "disabled",
        agg,
      };
      row = { ...row, ...rowMetrics };
      rows.push(row);

      if (this.groupByStation) {
        const staIndex = stations.indexOf(identifier);
        if (staIndex < 0) {
          stations.push(identifier);
          stationRows.push({
            ...{
              title,
              id: identifier,
              treeStatus: "collapsed",
              staCode: channel.stationCode,
              netCode: channel.networkCode,
              agg,
            },
            ...rowMetrics,
          });
        } else {
          stationRows[staIndex] = this.findWorstChannel(
            row,
            stationRows[staIndex]
          );
          // check if agg if worse than current agg
        }
      }
    });
    this.rows = [...stationRows, ...rows];
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getStyle(value, visualMap): string {
    let color;

    if (!visualMap) {
      color = "transparent";
    } else if (value !== null) {
      color = this.widgetTypeService.getColorFromValue(value, visualMap);
    } else {
      color = "gray";
    }
    return color;
  }
}
