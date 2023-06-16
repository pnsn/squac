import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
/**
 * Login page parent
 */
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  standalone: true,
  imports: [RouterModule],
})
// Parent component for login pages
export class AuthComponent {}
