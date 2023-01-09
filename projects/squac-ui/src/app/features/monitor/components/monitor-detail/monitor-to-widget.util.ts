/**
 * converts a monitor to a widget
 */

import { Monitor, Widget } from "squacapi";

export const convertMonitorToWidget = (monitor: Monitor): Widget => {
  const widget = new Widget(
    0,
    monitor.owner,
    monitor.name,
    null,
    [monitor.metric],
    "latest"
  );

  return widget;
};
