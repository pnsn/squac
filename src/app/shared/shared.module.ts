import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from './material.module';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ErrorComponent } from './error/error.component';
import { AbilityModule } from '@casl/angular';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ReplacePipe } from './pipes/replace.pipe';
import { OrganizationPipe } from './pipes/organization.pipe';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    LoadingComponent,
    MapComponent,
    ErrorComponent,
    ReplacePipe,
    OrganizationPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule,
    NgxDatatableModule
  ],
  exports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    NgxDatatableModule,
    MapComponent,
    ErrorComponent,
    AbilityModule,
    ConfirmDialogComponent,
    ReplacePipe,
    LeafletModule,
    LeafletDrawModule,
    OrganizationPipe
  ]
})

export class SharedModule { }
