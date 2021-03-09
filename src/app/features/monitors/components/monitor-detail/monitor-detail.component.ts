import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Monitor } from '@features/monitors/models/monitor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monitor-detail',
  templateUrl: './monitor-detail.component.html',
  styleUrls: ['./monitor-detail.component.scss']
})
export class MonitorDetailComponent implements OnInit {
  monitor: Monitor;
  subscription: Subscription = new Subscription();
  error: boolean;
  metric: Metric;
  metrics: Metric[];
  channelGroups: ChannelGroup[];
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        if (data.monitor.error){
          this.error = true;
        } else {
          this.error = false;
          this.monitor = data.monitor;
        }
      }
    );
  }

  editMonitor() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }


}
