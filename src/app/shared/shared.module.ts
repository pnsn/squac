import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup/popup.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    ModalComponent,
    PopupComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    ModalComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoadingComponent,
    NgxDatatableModule
  ]
})

export class SharedModule { }
