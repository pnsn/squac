import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewService } from '@core/services/view.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent {
  opened = true;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(
    private viewService: ViewService
  ) {

  }
  collapseSidebar(){
    this.viewService.resizeAll();
    this.sidenav.toggle();
  }
}
