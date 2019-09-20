import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    ModalComponent,
    PopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
