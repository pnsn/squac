import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoadingComponent } from "./components/loading/loading.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MaterialModule } from "./material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ErrorComponent } from "./components/error/error.component";
import { AbilityModule } from "@casl/angular";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ReplacePipe } from "./pipes/replace.pipe";
import { OrganizationPipe } from "./pipes/organization.pipe";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { UserPipe } from "./pipes/user.pipe";
import { SharedIndicatorComponent } from "./components/shared-indicator/shared-indicator.component";
import { TableViewComponent } from "./components/table-view/table-view.component";

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LoadingComponent,
    ErrorComponent,
    ReplacePipe,
    OrganizationPipe,
    SnackbarComponent,
    UserPipe,
    SharedIndicatorComponent,
    TableViewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule,
    NgxDatatableModule,
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
    ReplacePipe,
    LeafletModule,
    LeafletDrawModule,
    OrganizationPipe,
    SnackbarComponent,
    SharedIndicatorComponent,
    UserPipe,
    TableViewComponent,
  ],
})
export class SharedModule {}
