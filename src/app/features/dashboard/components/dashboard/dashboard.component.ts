import { Component, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { ViewService } from "@core/services/view.service";

@Component({
  selector: "dashboard-main",
  template: "<router-outlet></router-outlet>",
})
export class DashboardComponent {
  opened = true;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(private viewService: ViewService) {}
  collapseSidebar() {
    this.viewService.resizeAll();
    this.sidenav.toggle();
  }
}
