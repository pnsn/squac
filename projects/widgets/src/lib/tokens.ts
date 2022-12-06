import { InjectionToken } from "@angular/core";

export const DATE_FORMAT = new InjectionToken<string>(
  "Date format used by default on widgets.",
  {
    factory: (): string => "Token Value",
  }
);
