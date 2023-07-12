import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/**
 * User Container
 */
@Component({
  selector: "user-main",
  template: "<router-outlet></router-outlet>",
  standalone: true,
  imports: [RouterOutlet],
})
export class UserComponent {}
