import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent {
  previousUrl;
  constructor(router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log("prev:", event.url);
        this.previousUrl = event.url;
      });
  }
}
