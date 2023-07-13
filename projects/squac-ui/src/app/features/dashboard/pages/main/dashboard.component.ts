import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/**
 * Container component for dashboards
 */
@Component({
  selector: "dashboard-main",
  template: "<router-outlet></router-outlet>",
  standalone: true,
  imports: [RouterOutlet],
})
export class DashboardComponent {}
