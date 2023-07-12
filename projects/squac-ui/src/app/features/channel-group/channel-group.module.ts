import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { ChannelGroupFilterComponent } from "./components/channel-group-filter/channel-group-filter.component";
import { ChannelGroupRoutingModule } from "./channel-group-routing.module";
import { ChannelGroupMapComponent } from "./components/channel-group-map/channel-group-map.component";
import { MatchingRuleEditComponent } from "./components/matching-rule-edit/matching-rule-edit.component";
import { ChannelGroupTableComponent } from "./components/channel-group-table/channel-group-table.component";
import { CsvUploadComponent } from "./components/csv-upload/csv-upload.component";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { ChannelGroupComponent } from "./pages/main/channel-group.component";
import { ChannelGroupEditComponent } from "./pages/edit/channel-group-edit.component";
import { ChannelGroupViewComponent } from "./pages/list/channel-group-view.component";
import { ChannelGroupDetailComponent } from "./pages/detail/channel-group-detail.component";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TooltipDirective } from "@shared/directives/tooltip.directive";

/**
 *
 */
@NgModule({
  declarations: [
    ChannelGroupEditComponent,
    ChannelGroupViewComponent,
    ChannelGroupDetailComponent,
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ChannelGroupComponent,
    ChannelGroupFilterComponent,
    MatchingRuleEditComponent,
    ChannelGroupTableComponent,
    CsvUploadComponent,
    ChannelGroupMapComponent,
    CommonModule,
    ChannelGroupRoutingModule,
    TooltipDirective,
    LoadingDirective,
  ],
})
export class ChannelGroupModule {}
