import { Component, OnInit } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";

import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  template:
    "<app-loading-screen></app-loading-screen><router-outlet></router-outlet>",
})

// App parent component
export class AppComponent implements OnInit {
  title;
  constructor(
    private authService: AuthService,
    configService: ConfigurationService
  ) {
    this.title = configService.getValue("appTitle", "SQUAC");
  }

  ngOnInit() {
    this.authService.autologin();
  }
}
