import { Component, OnInit } from "@angular/core";
import { LoadingService } from "@core/services/loading.service";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})

// App parent component
export class AppComponent implements OnInit {
  title = "SQUAC";
  constructor(
    private authService: AuthService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.authService.autologin();
  }
}
