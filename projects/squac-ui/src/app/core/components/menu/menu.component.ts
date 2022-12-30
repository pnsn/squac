import { Component, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { User } from "squacapi";

/**
 * Navigation menu component
 */
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
  /** logged in user */
  @Input() user!: User;
  /** true if using sidenav view */
  @Input() isSidenav?: boolean;
  constructor(private authService: AuthService) {}
  /**
   * logs user out
   */
  logout(): void {
    this.authService.logout();
  }
}
