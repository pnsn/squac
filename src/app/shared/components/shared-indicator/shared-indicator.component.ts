import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-indicator',
  templateUrl: './shared-indicator.component.html',
  styleUrls: ['./shared-indicator.component.scss']
})
export class SharedIndicatorComponent implements OnInit {
  @Input() shareOrg: boolean;
  @Input() shareAll: boolean;
  @Input() resource: string;
  constructor() { }

  ngOnInit(): void {
  }

}
