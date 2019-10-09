import { Component, OnInit, Input } from '@angular/core';
import { Widget } from '../../widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../../../shared/channel-group';
import { MeasurementsService } from '../../measurements.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() widget: Widget;
  @Input() channelGroup: ChannelGroup;
  data: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measurementsService: MeasurementsService
  ) { }

  ngOnInit() {
    this.measurementsService.getMeasurements(
      this.widget.metricsString,
      this.channelGroup.channelsString,
      '2018-01-01',
      '2019-10-02'
    ).subscribe(
      response => {
        this.data = response;
      }
    );
  }

  hasData(channelId, metricId): boolean {
    return this.data[channelId] && this.data[channelId][metricId];
  }

  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
