import { Component, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { User } from "squacapi";

/**
 *
 */
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent {
  @Input() user!: User;
  @Input() isSidenav?: boolean;
  constructor(private authService: AuthService) {}
  /**
   *
   */
  logout(): void {
    this.authService.logout();
  }
}
