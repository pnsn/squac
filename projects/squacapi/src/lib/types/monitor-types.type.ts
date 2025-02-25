import { ReadOnlyMonitorDetailSerializer } from "@pnsn/ngx-squacapi-client";

// export type IntervalType = ReadOnlyMonitorDetailSerializer.IntervalTypeEnum;
export type IntervalType = "minute" | "hour" | "day";
export type MonitorStatType = ReadOnlyMonitorDetailSerializer.StatEnum;
