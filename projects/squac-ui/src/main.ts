import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { APP_CONFIG } from "./app/app.config";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, APP_CONFIG);
