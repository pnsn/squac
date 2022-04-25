import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Metric } from "@core/models/metric";
import { MetricsService } from "@features/metrics/services/metrics.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-metrics-view",
  templateUrl: "./metrics-view.component.html",
  styleUrls: ["./metrics-view.component.scss"],
})
export class MetricsViewComponent implements OnInit, OnDestroy, AfterViewInit {
  metrics: Metric[];
  subscription: Subscription = new Subscription();
  selectedMetric: Metric;
  selected = false;
  options = {};
  columns = [];
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  @ViewChild("linkTemplate") linkTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metricsService: MetricsService
  ) {}

  ngOnInit() {
    if (this.route.parent) {
      this.metrics = this.route.parent.snapshot.data.metrics;
    }
  }

  ngAfterViewInit(): void {
    this.columns = [
      {
        name: "Name",
        draggable: false,
        sortable: true,
        width: 300,
        canAutoResize: false,
      },
      {
        name: "Default Min",
        prop: "minVal",
        draggable: false,
        canAutoResize: false,
        sortable: true,
        width: 100,
      },
      {
        name: "Default Max",
        prop: "maxVal",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 100,
      },
      {
        name: "Unit",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 100,
      },
      {
        name: "Sample Rate",
        prop: "sampleRate",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 70,
      },
      {
        name: "Description",
        draggable: false,
        sortable: true,
      },
      {
        name: "Info",
        prop: "refUrl",
        draggable: false,
        canAutoResize: false,
        sortable: true,
        width: 50,
        cellTemplate: this.linkTemplate,
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMetric() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  editMetric() {
    this.router.navigate([`${this.selectedMetric.id}/edit`], {
      relativeTo: this.route,
    });
  }

  onSelect($event) {
    this.selected = true;
    this.metricsService.getMetric($event.selected[0].id).subscribe(
      (metric) => {
        this.selectedMetric = metric;
      },
      (error) => {
        console.log("error in metrics view: " + error);
      }
    );
  }
}
