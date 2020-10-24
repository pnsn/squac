import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DashboardsService } from '../../services/dashboards.service';
import { StatTypeService } from '@features/widgets/services/stattype.service';
import { ViewService } from '@core/services/view.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {
  opened = true;
  @ViewChild(MatSidenav) sidenav : MatSidenav;

  constructor(
    private viewService: ViewService
  ) {

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  collapseSidebar(){
    this.viewService.resizeAll()
    this.sidenav.toggle();
  }
}
