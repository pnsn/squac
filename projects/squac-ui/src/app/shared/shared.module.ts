import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoadingComponent } from "./components/loading/loading.component";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { MaterialModule } from "./material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ErrorComponent } from "./components/error/error.component";
import { AbilityModule } from "@casl/angular";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { SharedIndicatorComponent } from "./components/shared-indicator/shared-indicator.component";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { SearchFilterComponent } from "./components/search-filter/search-filter.component";
import { DateSelectComponent } from "./components/date-select/date-select.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ChannelGroupSelectorComponent } from "./components/channel-group-selector/channel-group-selector.component";
import { LoadingOverlayComponent } from "./components/loading-overlay/loading-overlay.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { DetailPageComponent } from "./components/detail-page/detail-page.component";
import { SquacapiModule } from "squacapi";
import { SharingToggleComponent } from "./components/sharing-toggle/sharing-toggle.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
/**
 * Shared module for features
 */
@NgModule({
  declarations: [
    SearchFilterComponent,
    ConfirmDialogComponent,
    LoadingComponent,
    ErrorComponent,

    SnackbarComponent,
    SharedIndicatorComponent,
    TableViewComponent,
    DateSelectComponent,
    ChannelGroupSelectorComponent,
    LoadingOverlayComponent,
    LoadingSpinnerComponent,
    DetailPageComponent,
    SharingToggleComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxDaterangepickerMd.forRoot(),
    SquacapiModule,
    TooltipModule,
  ],
  exports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    NgxDatatableModule,
    ErrorComponent,
    AbilityModule,
    ConfirmDialogComponent,
    LeafletModule,
    LeafletDrawModule,
    SnackbarComponent,
    SharedIndicatorComponent,
    TableViewComponent,
    SearchFilterComponent,
    DateSelectComponent,
    ChannelGroupSelectorComponent,
    LoadingOverlayComponent,
    LoadingSpinnerComponent,
    SquacapiModule,
    DetailPageComponent,
    SharingToggleComponent,
  ],
})
export class SharedModule {}
