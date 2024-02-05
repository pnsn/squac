import { Component, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { User } from "squacapi";
import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { AbilityModule } from "@casl/angular";

/**
 * Navigation menu component
 */
@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  standalone: true,
  imports: [
    NgClass,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    NgIf,
    AbilityModule,
    NgTemplateOutlet,
  ],
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
