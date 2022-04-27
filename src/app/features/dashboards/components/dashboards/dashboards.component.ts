import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { ViewService } from "@core/services/view.service";

@Component({
  selector: "app-dashboards",
  template: "<router-outlet></router-outlet>",
})
export class DashboardsComponent {
  opened = true;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(private viewService: ViewService) {}
  collapseSidebar() {
    this.viewService.resizeAll();
    this.sidenav.toggle();
  }
}
