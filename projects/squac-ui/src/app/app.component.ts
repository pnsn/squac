import { Component, OnInit } from "@angular/core";
import { LoadingService } from "@core/services/loading.service";
import { AuthService } from "@core/services/auth.service";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { RouterOutlet } from "@angular/router";
import { AsyncPipe } from "@angular/common";

/**
 * Main app component
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [LoadingDirective, RouterOutlet, AsyncPipe],
})
export class AppComponent implements OnInit {
  title = "SQUAC";
  constructor(
    private authService: AuthService,
    public loadingService: LoadingService
  ) {}

  /**
   * Log in
   */
  ngOnInit(): void {
    this.authService.autologin();
  }
}
