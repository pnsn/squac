//widget error text

export enum WidgetErrors {
  NO_METRICS = "No metrics selected.",
  NO_CHANNELS = "No channels selected.",
  BAD_CONFIGURATION = "Widget could not be loaded.",
  NO_MEASUREMENTS = "No measurements found.",
  MISSING_METRICS = "Not enough metrics selected for this widget type.",
  SQUAC_ERROR = "Could not get data from SQUAC.",
}

// export const WidgetErrorsFix = {
//   [WidgetErrors.NO_METRICS]: "Select new metrics.",
//   [WidgetErrors.NO_CHANNELS]: "Select a channel group.",
//   [WidgetErrors.BAD_CONFIGURATION]: "Check widget configuration.",
//   [WidgetErrors.NO_MEASUREMENTS]: "Try searching for different time ranges.",
//   [WidgetErrors.SQUAC_ERROR]: "",
//   [WidgetErrors.MISSING_METRICS]: "Edit the widget and add metrics.",
// };
