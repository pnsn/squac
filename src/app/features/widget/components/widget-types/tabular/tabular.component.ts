import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { ColumnMode, SortType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@widget/models/threshold";
import { Channel } from "@core/models/channel";
import { checkThresholds } from "@core/utils/utils";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
})
export class TabularComponent
  implements OnInit, OnDestroy, OnChanges, WidgetTypeComponent
{
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  subscription = new Subscription();

  @ViewChild("dataTable") table: any;
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

  // rows = [];
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      this.buildRows(this.data);
      console.log("data changed");
    }
  }

  ngOnInit() {
    this.columns = [
      {
        name: "Channel",
        prop: "title",
        isTreeColumn: true,
        width: 150,
        canAutoResize: false,
        frozenLeft: true,
        resizeable: false,
      },
      {
        name: "agg",
        width: 50,
        canAutoResize: false,
        frozenLeft: true,
        resizeable: false,
      },
    ];

    this.metrics.forEach((metric) => {
      this.columns.push({
        name: metric.name,
        prop: metric.id,
        comparator: this.metricComparator.bind(this),
        minWidth: 100,
        cellClass: this.getCellClass,
        canAutoResize: true,
        sortable: true,
      });
    });
    this.buildRows(this.data);
  }

  private metricComparator(propA, propB) {
    const result = propA.value - propB.value;
    return result;
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
    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + "." + channel.stationCode;

      let agg = 0;
      const rowMetrics = {};

      this.metrics.forEach((metric) => {
        let val: number = null;

        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }

        // const val = this.measurement.transform(data[channel.id][metric.id], this.widget.stattype.id);
        const threshold = this.thresholds[metric.id];
        const inThreshold = threshold ? checkThresholds(threshold, val) : false;

        if (threshold && val != null && !inThreshold) {
          agg++;
        }
        rowMetrics[metric.id] = {
          value: val,
          classes: {
            "out-of-spec": val !== null && !inThreshold && !!threshold,
            "in-spec": val !== null && inThreshold && !!threshold,
            "has-threshold": !!threshold,
          },
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

  getCellClass({ row, column, _value }): any {
    return row[column.prop].classes;
  }
}
