import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-d3-timeline',
    styles:['.timeline-container {height: 10px; width: 100px}'],
    template: '<div class="timeline-container"><div id="timeline1"></div></div>'
})
export class D3TimelineComponent implements OnInit {

  @Input('data') datas: any;
  @Input() id: number;

  ngOnInit(){
    
  }
}
