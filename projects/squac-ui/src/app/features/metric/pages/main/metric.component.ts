import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/** metric container component */
@Component({
  selector: "metric-main",
  template: "<router-outlet></router-outlet>",
  standalone: true,
  imports: [RouterOutlet],
})
export class MetricComponent {}
