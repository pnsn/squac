import { Channel } from "squacapi";
import { Metric } from "squacapi";

/** example start */
export const endtime = "2022-11-03T23:53:51Z";
/** example end */
export const starttime = "2022-11-02T23:53:51Z";

/**
 * Creates fake channels using the given parameters.
 *
 * @param numChannels number of channels per station to create
 * @param numStations number of stations per network to create
 * @param numNetworks number of networks to create
 * @returns Array of channels with the given size
 */
export const getFakeChannels = (
  numChannels = 3,
  numStations = 3,
  numNetworks = 2
): Channel[] => {
  const channels = [];

  for (let n = 1; n <= numNetworks; n++) {
    const network = "net" + n;

    for (let s = 1; s <= numStations; s++) {
      const station_code = "sta" + s;
      const loc = "--";
      const lat = 40 + Math.random() * s;
      const lon = -120 + Math.random() * s;
      for (let c = 1; c <= numChannels; c++) {
        const code = "chan" + c;

        channels.push(
          new Channel({
            id: +`${n}${s}${c}`,
            code,
            lat,
            lon,
            loc,
            station_code: station_code,
            network,
            nslc: `${network}.${station_code}.${loc}.${code}`,
          })
        );
      }
    }
  }

  return channels;
};

/**
 * Creates fake metrics
 *
 * @param numMetrics Number of desired metrics
 * @returns Array of metrics
 */
export const getFakeMetrics = (numMetrics = 1): Metric[] => {
  const metrics = [];

  for (let m = 1; m <= numMetrics; m++) {
    const sample_rate = 3600 * m;
    const default_minval = m;
    const default_maxval = 10 * m;
    metrics.push(
      new Metric({
        id: m,
        user: 1,
        name: `Example Metric ${m}`,
        code: `example_metric_${m}`,
        unit: "unit",
        sample_rate,
        default_minval,
        default_maxval,
      })
    );
  }
  return metrics;
};
