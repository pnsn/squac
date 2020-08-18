import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { MetricsComponent } from './components/metrics/metrics.component';
import { MetricsDetailComponent } from './components/metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './components/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './components/metrics-edit/metrics-edit.component';

@NgModule({
  declarations: [
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  ],
  entryComponents: [
  ]
})
export class MetricsModule { }
