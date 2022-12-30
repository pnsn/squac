import { Component, OnInit } from "@angular/core";
import { LoadingService } from "@core/services/loading.service";
import { AuthService } from "@core/services/auth.service";

/**
 * Main app component
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "SQUAC";
  constructor(
    private authService: AuthService,
    public loadingService: LoadingService
  ) {}

  /**
   * Liog in
   */
  ngOnInit(): void {
    this.authService.autologin();
  }
}
