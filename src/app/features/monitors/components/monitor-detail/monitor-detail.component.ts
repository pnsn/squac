import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Monitor } from '@features/monitors/models/monitor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monitor-detail',
  templateUrl: './monitor-detail.component.html',
  styleUrls: ['./monitor-detail.component.scss']
})
export class MonitorDetailComponent implements OnInit {
  monitor : Monitor;
  subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.monitor = data.monitor;
      }
    )


    
    console.log(this.monitor)
  }

}
