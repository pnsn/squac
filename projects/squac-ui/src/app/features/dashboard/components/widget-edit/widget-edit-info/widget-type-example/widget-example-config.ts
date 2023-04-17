import { Channel } from "squacapi";
import { Metric } from "squacapi";

/** example start */
export const endtime = "2022-11-03T23:53:51Z";
/** example end */
export const starttime = "2022-11-02T23:53:51Z";

/** selected metrics */
export const selectedMetrics = [
  new Metric({
    id: 1,
    user: 1,
    name: "Example Metric 1",
    code: "example_metric",
    description: "",
    unit: "unit",
    reference_url: "",
    sample_rate: 3600,
    default_minval: 0,
    default_maxval: 340,
  }),
  new Metric({
    id: 2,
    user: 1,
    name: "Example Metric 2",
    code: "example_metric_2",
    description: "",
    unit: "unit",
    reference_url: "",
    sample_rate: 1800,
    default_minval: 0,
    default_maxval: 10000,
  }),
  new Metric({
    id: 3,
    user: 1,
    name: "Example Metric 3",
    code: "example_metric_3",
    description: "",
    unit: "unit",
    reference_url: "",
    sample_rate: 5400,
    default_minval: -100,
    default_maxval: 100,
  }),
];

/** selected channels */
export const channels = [
  new Channel({
    id: 1,
    code: "code1",
    name: "",
    lat: 40,
    lon: -120,
    elev: 5,
    loc: "loc",
    station_code: "sta1",
    network: "net",
    nslc: "net.sta1.loc.code1",
  }),
  new Channel({
    id: 2,
    code: "code2",
    name: "",
    lat: 40,
    lon: -120,
    elev: 5,
    loc: "loc",
    station_code: "sta1",
    network: "net",
    nslc: "net.sta1.loc.code2",
  }),

  new Channel({
    id: 3,
    code: "code3",
    name: "",
    lat: 40,
    lon: -120,
    elev: 5,
    loc: "loc",
    station_code: "sta1",
    network: "net",
    nslc: "net.sta1.loc.code3",
  }),

  new Channel({
    id: 4,
    code: "code1",
    name: "",
    lat: 41,
    lon: -121,
    elev: 5,
    loc: "loc",
    station_code: "sta2",
    network: "net",
    nslc: "net.sta2.loc.code1",
  }),

  new Channel({
    id: 5,
    code: "code2",
    name: "",
    lat: 41,
    lon: -121,
    elev: 5,
    loc: "loc",
    station_code: "sta2",
    network: "net",
    nslc: "net.sta2.loc.code2",
  }),
  new Channel({
    id: 6,
    code: "code3",
    name: "",
    lat: 41,
    lon: -121,
    elev: 5,
    loc: "loc",
    station_code: "sta2",
    network: "net",
    nslc: "net.sta2.loc.code3",
  }),

  new Channel({
    id: 7,
    code: "code1",
    name: "",
    lat: 39.5,
    lon: -122,
    elev: 5,
    loc: "loc",
    station_code: "sta3",
    network: "net",
    nslc: "net.sta3.loc.code1",
  }),

  new Channel({
    id: 8,
    code: "code2",
    name: "",
    lat: 39.5,
    lon: -122,
    elev: 5,
    loc: "loc",
    station_code: "sta3",
    network: "net",
    nslc: "net.sta3.loc.code2",
  }),

  new Channel({
    id: 9,
    code: "code3",
    name: "",
    lat: 39.5,
    lon: -122,
    elev: 5,
    loc: "loc",
    station_code: "sta3",
    network: "net",
    nslc: "net.sta3.loc.code3",
  }),
];
