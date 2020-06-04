import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  template: '<div id="error-container">{{errorMsg}}<div>',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() errorMsg: string;
  constructor() { }

  ngOnInit(): void {
    console.log("error component loaded")
  }

}
