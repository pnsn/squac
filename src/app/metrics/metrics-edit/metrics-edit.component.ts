import { Component, OnInit, OnDestroy } from '@angular/core';
import { Metric } from '../../shared/metric';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MetricsService } from '../../shared/metrics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics-edit',
  templateUrl: './metrics-edit.component.html',
  styleUrls: ['./metrics-edit.component.scss']
})
export class MetricsEditComponent implements OnInit, OnDestroy {
  id: number;
  metric: Metric;
  editMode: boolean;
  metricForm: FormGroup;
  subscriptions : Subscription = new Subscription();

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private metricsService : MetricsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    );

    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm() {
    this.metricForm = this.formBuilder.group({
      'name' : new FormControl("", Validators.required),
      'description': new FormControl("", Validators.required),
      'source': new FormControl("", Validators.required),
      'unit': new FormControl("", Validators.required)
    });

    if (this.editMode) {
      this.metricsService.getMetric(this.id).subscribe(
        metric => {
          this.metricForm.patchValue({
            "name" : metric.name,
            "description" : metric.description,
            "source" : metric.source,
            "unit" : metric.unit
          });
        }
      );
    }
  }
  // Save channel information
  save() {
    let values = this.metricForm.value;
    this.metricsService.updateMetric(
      new Metric(
        this.id,
        values.name,
        values.description, 
        values.source,
        values.unit
      )
    ).subscribe(
      result => {
        this.cancel(result.id)
      }
    );
  }

  // Exit page
  //TODO: warn if unsaved
  cancel(id? : number) {
    if(id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

}
