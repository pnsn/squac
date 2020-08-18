import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit {
  loading: boolean;
  status: string;
  constructor() { }

  ngOnInit(): void {
    this.loading = true;
    this.status = "text here";
  }

}
