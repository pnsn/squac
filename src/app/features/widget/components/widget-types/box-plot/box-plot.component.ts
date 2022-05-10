import { Component, OnInit } from "@angular/core";

@Component({
  selector: "widget-box-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class BoxPlotComponent implements OnInit {
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;
  constructor() {}

  ngOnInit(): void {}
}
