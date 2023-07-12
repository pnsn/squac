import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/** Monitor container component */
@Component({
  selector: "monitor-main",
  template: "<router-outlet></router-outlet>",
  standalone: true,
  imports: [RouterOutlet],
})
export class MonitorComponent {}
