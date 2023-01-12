/**
 * converts a monitor to a widget
 */

import { Monitor, Threshold, Widget } from "squacapi";

export const convertMonitorToWidget = (monitor: Monitor): Widget => {
  const widget = new Widget(
    0,
    monitor.owner,
    monitor.name,
    null,
    [monitor.metric],
    "latest"
  );
//thresholds could overlap because alerts vary?
  const threshold : Threshold = {
    type: "piecewise",
    min:
  }

  return widget;
};

//monitor threshold
/**
 * displayType:threshold
 * dimension: ???
 * type: markLine/markArea
 */
