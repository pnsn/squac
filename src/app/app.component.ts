import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { LoadingService } from "@core/services/loading.service";

import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})

// App parent component
export class AppComponent implements OnInit {
  title;
  constructor(
    private authService: AuthService,
    configService: ConfigurationService,
    public loadingService: LoadingService
  ) {
    this.title = configService.getValue("appTitle", "SQUAC");
  }

  ngOnInit() {
    this.authService.autologin();
  }
}
