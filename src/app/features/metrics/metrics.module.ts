import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { AbilityModule } from '@casl/angular';
import { MetricsComponent } from './metrics.component';
import { MetricsDetailComponent } from './metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './metrics-view/metrics-view.component';
import { MetricsEditComponent } from './metrics-edit/metrics-edit.component';

@NgModule({
  declarations: [
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent,
  ],
  imports: [
    AbilityModule,
    CommonModule,
    SharedModule
  ],
  exports: [
  ],
  entryComponents: [
  ]
})
export class MetricsModule { }
