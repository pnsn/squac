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
    if (this.route.parent.snapshot && this.route.parent.snapshot.data) {
      this.metrics = this.route.parent.snapshot.data.metrics;
      this.channelGroups = this.route.parent.snapshot.data.channelGroups;
    }
    this.route.data.subscribe(
      data => {
        if (data.monitor.error){
          this.error = true;
        } else {
          this.error = false;
          this.monitor = data.monitor;
          this.metric = this.metrics.find(m => m.id === this.monitor.metricId);
        }
      }
    );



    console.log(this.monitor);
  }


  channelGroupName(id: number): string{
    const group = this.channelGroups.find(cG => cG.id === id);
    return group ? group.name : 'unknown';
  }

  metricName(id: number): string {
    const metric = this.metrics.find(m => m.id === id);
    return metric ? metric.name : 'unknown';
  }

  editMonitor() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }


}
