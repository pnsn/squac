import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: '<div id="loading-container"><span>loading...<span><div>',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
