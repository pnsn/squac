import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoadingComponent } from "./components/loading/loading.component";
import { MaterialModule } from "./material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ErrorComponent } from "./components/error/error.component";
import { AbilityModule } from "@casl/angular";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { SharedIndicatorComponent } from "./components/shared-indicator/shared-indicator.component";
import { SearchFilterComponent } from "./components/search-filter/search-filter.component";
import { DateSelectComponent } from "./components/date-select/date-select.component";
import { ChannelGroupSelectorComponent } from "./components/channel-group-selector/channel-group-selector.component";
import { LoadingOverlayComponent } from "./components/loading-overlay/loading-overlay.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";
import { SquacapiModule } from "squacapi";
import { SharingToggleComponent } from "./components/sharing-toggle/sharing-toggle.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { LoadingDirective } from "./directives/loading-directive.directive";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
/**
 * Shared module for features
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SquacapiModule,
    TooltipModule,
    LoadingDirective,
    TableViewComponent,
    SharedIndicatorComponent,
    SharingToggleComponent,
    SearchFilterComponent,
    LoadingSpinnerComponent,
    LoadingComponent,
    LoadingOverlayComponent,
    ChannelGroupSelectorComponent,
    ConfirmDialogComponent,
    DateSelectComponent,
    ErrorComponent,
    DetailPageComponent,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    ErrorComponent,
    AbilityModule,
    ConfirmDialogComponent,
    LeafletModule,
    LeafletDrawModule,
    SharedIndicatorComponent,
    SearchFilterComponent,
    DateSelectComponent,
    ChannelGroupSelectorComponent,
    LoadingOverlayComponent,
    LoadingSpinnerComponent,
    SquacapiModule,
    DetailPageComponent,
    SharingToggleComponent,
    TableViewComponent,
  ],
})
export class SharedModule {}
