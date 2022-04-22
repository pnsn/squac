import { NgModule } from "@angular/core";

import { DashboardsComponent } from "./components/dashboards/dashboards.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { DashboardEditComponent } from "./components/dashboard-edit/dashboard-edit.component";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { AbilityModule } from "@casl/angular";
import { SharedModule } from "@shared/shared.module";
import { WidgetsModule } from "@features/widgets/widgets.module";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";

@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    DashboardEditEntryComponent,
  ],
  imports: [
    WidgetsModule,
    DashboardsRoutingModule,
    SharedModule,
    AbilityModule,
    NgxDaterangepickerMd.forRoot(),
  ],
})
export class DashboardsModule {}
