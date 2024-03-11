import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MessageService } from "../../services/message.service";
import { User } from "squacapi";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MenuComponent } from "../../components/menu/menu.component";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
/**
 * Home page
 */
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MenuComponent,
    MatIconModule,
    NgIf,
  ],
})
export class HomeComponent implements OnInit {
  /** active squac user */
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  /**
   * Get's user from resolver data
   */
  ngOnInit(): void {
    // get user for header
    if (this.route.snapshot?.data["user"]) {
      this.user = this.route.snapshot.data["user"];
    } else {
      this.messageService.error("Could not load user information.");
    }
  }
}
