import { Component, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { User } from "@squacapi/models/user";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input() user: User;
  showMenu: boolean;

  constructor(private authService: AuthService) {}

  // log user out
  logout() {
    this.authService.logout();
  }
}
