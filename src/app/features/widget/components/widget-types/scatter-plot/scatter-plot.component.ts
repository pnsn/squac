import { Component, OnInit } from "@angular/core";

@Component({
  selector: "widget-scatter-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.html"],
})
export class ScatterPlotComponent implements OnInit {
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;
  constructor() {}

  ngOnInit(): void {}
}
