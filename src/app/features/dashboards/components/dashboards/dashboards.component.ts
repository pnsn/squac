import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardsService } from '../../services/dashboards.service';
import { StatTypeService } from '@features/widgets/services/stattype.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {
  opened = true;

  constructor(
    private dashboardsService: DashboardsService,
    private statTypeService: StatTypeService
  ) {

  }

  ngOnInit() {
    this.statTypeService.fetchStatTypes();
  }

  ngOnDestroy(): void {
  }
}
