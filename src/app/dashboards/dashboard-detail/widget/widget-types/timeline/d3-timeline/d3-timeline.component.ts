import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-d3-timeline',
    styles:['.timeline-container {height: 10px, width: 100px}'],
    template: '<div class="timeline-container"><div [id]="selector"></div></div>'
})
export class D3TimelineComponent implements OnInit {
  @Input() data: any;
  @Input() id: number;

  selector : string;
  private chart: any;

    public ngOnInit() {
      console.log(this.data)
      this.selector = "timeline-" + this.id;
      console.log(this.selector)
      // this.chart = d3timelines.timelines();
      
        // d3.select(this.selector).append('svg').attr('width', 500)
        // .datum(this.data).call(this.chart);
    }
}
