import { InjectionToken } from "@angular/core";

export const MY_TOKEN = new InjectionToken<string>("MyToken", {
  factory: () => "Token Value",
});
