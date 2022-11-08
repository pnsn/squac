import { NgModule } from "@angular/core";

import { DashboardComponent } from "./components/dashboard-main/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { DashboardEditComponent } from "./components/dashboard-edit/dashboard-edit.component";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AbilityModule } from "@casl/angular";
import { SharedModule } from "@shared/shared.module";
import { WidgetModule } from "@widget/widget.module";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";
import { DataTypeSelectorComponent } from "./components/dashboard-detail/data-type-selector/data-type-selector.component";
import { ChannelFilterComponent } from "./components/dashboard-detail/channel-filter/channel-filter.component";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    DashboardEditEntryComponent,
    DataTypeSelectorComponent,
    ChannelFilterComponent,
  ],
  imports: [WidgetModule, DashboardRoutingModule, SharedModule, AbilityModule],
})
export class DashboardModule {}
