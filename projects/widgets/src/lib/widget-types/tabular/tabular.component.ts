import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import {
  StoplightVisualMapOption,
  VisualMapTypes,
  WidgetTypeComponent,
} from "../../interfaces";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { GenericWidgetComponent } from "../../components";
import { Row } from "./types";
import { Channel, MeasurementPipe, MeasurementTypes } from "squacapi";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PrecisionPipe } from "../../pipes/precision.pipe";
import { NgForOf, NgIf, NgStyle, NgTemplateOutlet } from "@angular/common";

/**
 * Table based widget
 */
@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PrecisionPipe,
    NgStyle,
    NgTemplateOutlet,
    NgForOf,
    NgIf,
  ],
})
export class TabularComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  /** nslc of currently emphasized channel */
  emphasizedChannel: string;
  /** nslc of channel to deemphasize */
  deemphasizedChannel: string;
  /** table rows */
  rows = [];
  /** table columns */
  columns = [];
  /** currently selected rows */
  selectedRow = [];
  /** pipe for transforming measurements */
  measurementPipe = new MeasurementPipe();

  /** Mat sort directive, used to enable sorting on */
  @ViewChild(MatSort) sort: MatSort;
  /** columns shown in table */
  metricColumns: string[] = ["title", "agg"];
  /** alert table data source */
  dataSource: MatTableDataSource<Row> = new MatTableDataSource([]);
  /** selection on alert table */
  selection: SelectionModel<Row> = new SelectionModel(true, []);

  expandedElement: Row | null;

  /** true if table should use nested rows for stations and channels */
  useStationView = false;

  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone,
    override cdr: ChangeDetectorRef
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }

  /**
   * Init
   */
  override ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      data: Row,
      sortHeaderId: string
    ): string | number => {
      const dataItem = data[sortHeaderId];
      if (dataItem) {
        return dataItem;
      } else {
        return data.metrics[sortHeaderId]?.value;
      }
    };

    //override sort to allow child rows to stay with parent
    this.dataSource.sortData = (data: Row[], sort: MatSort): Row[] => {
      if (!sort.active || sort.direction === "") {
        return data;
      }

      // actively sorted column
      const active = sort.active;
      // sort direction
      const direction = sort.direction;

      // keep children grouped to parent

      // less than 0 if A is first, more than 0 if B is first
      return data.sort((a: Row, b: Row) => {
        let comparatorResult = 0;

        // b is directly behind parent
        if (b.parentId && !a.parentId) {
          return a.title.localeCompare(b.parentId);
        } else if (a.parentId && !b.parentId) {
          return b.title.localeCompare(a.parentId);
        }
        switch (sort.active) {
          case "title":
            comparatorResult = a.title.localeCompare(b.title);
            break;
          case "agg":
            comparatorResult = a.agg - b.agg;
            break;
          default:
            //keep no data values at the bottom
            if (a.metrics[active].value === null) return 1;
            if (b.metrics[active].value === null) return -1;
            comparatorResult =
              a.metrics[active].value - b.metrics[active].value;
            break;
        }
        return comparatorResult * (direction == "asc" ? 1 : -1);
      });
    };
    this.subscription.add(
      this.widgetManager.resize$.subscribe(this.resize.bind(this))
    );
    super.ngOnInit();
  }

  /**
   * override to disable
   *
   * @param _useDenseView unused
   */
  override useDenseView(_useDenseView: boolean): void {
    return;
  }

  /**
   * Disabled zoom
   */
  startZoom(): void {
    return;
  }

  /**
   * Disabled toggle key
   */
  toggleKey(): void {
    return;
  }

  /**
   * @override
   */
  changeMetrics(): void {
    this.dataSource.data = this.rows;
    if (this.useStationView && !this.metricColumns.includes("expand")) {
      this.metricColumns.unshift("expand");
    }
    this.columns = [
      ...this.metricColumns,
      ...this.selectedMetrics.map((metric) => metric.code), //has to be string
    ];
  }

  /**
   * @override
   */
  deemphasizeChannel(channel: string): void {
    this.deemphasizedChannel = channel;
  }

  /**
   * @override
   */
  emphasizeChannel(channel: string): void {
    const index = this.findRowIndex(channel);
    const row = this.rows[index];
    this.emphasizedChannel = channel;
    this.selectedRow = [row];
    // this.table.element.querySelector(".datatable-body").scrollTop =
    //   index * (this.table.rowHeight as number);
  }

  /**
   * disabled
   */
  configureChart(): void {
    return;
  }

  /**
   * redraw table on resize
   */
  resize(): void {
    // if (this.table) {
    //   this.table.recalculate();
    // }
  }

  /**
   * Finds index of row that has matching nslc
   *
   * @param nslc - channel nslc to find
   * @returns index of row
   */
  private findRowIndex(nslc: string): number {
    return this.rows.findIndex((row) => {
      return row.nslc === nslc;
    });
  }

  /**
   * Inserts child rows into a table if the row has children
   *
   * @param row row to expand
   */
  expandRow(row: Row): void {
    const data = [...this.rows];
    //if this row is already expanded, close it
    // if no children, ignore row and close others
    if (row === this.expandedElement || !row.children) {
      this.dataSource.data = this.rows;
      this.expandedElement = null;
      return;
    }

    const rowIndex = data.findIndex((item) => row.title === item.title);
    //splice children into data
    if (rowIndex > -1 && row.children) {
      data.splice(rowIndex + 1, 0, ...row.children);
    }

    this.dataSource.data = data;
    this.expandedElement = row;

    // if this row is not currentl expanded, insert child rows )

    // expandedElement = expandedElement === row ? null : row
  }

  /**
   * @override
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
    return new Promise<void>((resolve) => {
      let rows: Row[] = [];
      const stationRowsMap = new Map<string, Row>();

      // true if group channels by station
      this.useStationView =
        this.properties.displayType === "stoplight" ||
        this.properties.displayType === "worst";

      this.channels.forEach((channel: Channel) => {
        const stationId = channel.staCode;
        const nslc = channel.nslc;
        let stationRow: Row;
        const channelRow: Row = {
          title: this.useStationView ? `${channel.loc}.${channel.code}` : nslc,
          metrics: {},
          agg: 0,
        };
        // add station row that will expand to show channels
        if (this.useStationView) {
          channelRow.parentId = stationId;
          // add station row that will expand to show channels
          if (this.useStationView) {
            channelRow.parentId = stationId;
            if (!stationRowsMap.has(stationId)) {
              const stationRow: Row = {
                title: stationId,
                children: [],
                metrics: {},
                agg: 0,
                channelAgg: null,
              };
              stationRowsMap.set(stationId, stationRow);
            }
            stationRow = stationRowsMap.get(stationId);
          }
        }

        const channelMeasurements = data
          .filter((m) => m.channel === channel.id)
          .map((m) => {
            m.value = m.value ?? m[this.widgetManager.dataStat];
            return m;
          });

        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          if (stationRow && !stationRow.metrics[metric.code]) {
            stationRow.metrics[metric.code] = {
              id: metric.id,
              value: 0,
              color: null,
              inSpec: null,
            };
          }
          const measurements = channelMeasurements.filter(
            (m) => m.metric === metric.id
          );

          let value: number = null; //column value

          if (measurements.length > 0) {
            value = this.measurementPipe.transform(
              measurements,
              this.widgetManager.stat
            );

            this.widgetConfigService.calculateDataRange(metric.id, value);
          }

          // add metric data to channel row
          channelRow.metrics[metric.code] = {
            id: metric.id,
            value,
            color: null,
            inSpec: null,
          };
        });
        if (stationRow) {
          stationRow.children.push(channelRow);
        } else {
          rows.push(channelRow);
        }
      });

      if (this.useStationView) {
        rows = [...stationRowsMap.values()];
      }

      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        3
      );

      // row is either a station w/ children or just a channel
      rows.forEach((row: Row) => {
        // has children
        if (row.children?.length > 0) {
          this.processStationRow(row);
        } else {
          this.processRow(row);
        }
      });

      this.rows = rows;
      resolve();
    });
  }

  /**
   * Calculated color and value for a station
   *
   * @param row station row
   */
  processStationRow(row: Row): void {
    row.children.forEach((childRow, i) => {
      this.processRow(childRow);
      if (childRow.agg > 0) {
        row.agg++;
      }
      if (this.properties.displayType === "worst") {
        if (i === 0 || childRow.agg > row.channelAgg) {
          row.metrics = childRow.metrics;
          row.channelAgg = childRow.agg;
        }
      }
    });
    if (this.properties.displayType === "stoplight") {
      this.stationStoplight(row);
    }
  }

  /**
   *  Finds color and value for the given row
   *
   * @param row any row
   */
  processRow(row: Row): void {
    for (const m in row.metrics) {
      const metric = row.metrics[m];
      const visualMap = this.visualMaps[metric.id];
      const inRange = visualMap
        ? this.widgetConfigService.checkValue(metric.value, visualMap)
        : true;

      // metric is in spec if the value exists and is in Range
      const inSpec = metric.value !== null && visualMap && inRange;

      // display color for channel
      const color = this.getStyle(metric.value, visualMap);

      metric.color = color;
      metric.inSpec = inSpec;

      if (!inSpec) {
        row.agg++;
      }
    }
  }

  /**
   * Calculates properties for the station row for a single metric
   * with the stoplight type
   *
   * @param row station row
   */
  private stationStoplight(row: Row): void {
    for (const m in row.metrics) {
      const metric = row.metrics[m];
      const visualMap = this.visualMaps[metric.id] as StoplightVisualMapOption;
      // number of out of spec channels already
      let numOutOfSpec = 0;
      let numChannelsWithoutData = 0;
      row.children.forEach((childRow) => {
        if (childRow.metrics[m].value !== null) {
          numChannelsWithoutData++;
        }
        if (!childRow.metrics[m].inSpec) {
          numOutOfSpec++;
        }
      });

      const totalNumChannels = row.children.length;
      let color;
      if (numOutOfSpec === 0) {
        //some out of spec
        color = visualMap.colors.in;
      } else if (totalNumChannels === numOutOfSpec) {
        //all out of spec
        color = visualMap.colors.out;
      } else if (totalNumChannels > numOutOfSpec) {
        // all in spec
        color = visualMap.colors.middle;
      } else {
        // something got messed up
        color = "gray";
      }
      metric.value = numChannelsWithoutData > 0 ? numOutOfSpec : null;
      metric.color = color;
    }
  }

  /**
   * Finds color for value from visualmap
   *
   * @param value - value to check
   * @param visualMap - visual map
   * @returns color string
   */
  private getStyle(value: number, visualMap: VisualMapTypes): string {
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }
}
