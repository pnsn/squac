import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/**
 * Channel group container componenent
 */
@Component({
  selector: "channel-group-main",
  template: "<router-outlet></router-outlet>",
  standalone: true,
  imports: [RouterOutlet],
})
export class ChannelGroupComponent {}
