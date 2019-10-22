import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from '../../widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../../../shared/channel-group';
import { MeasurementsService } from '../../measurements.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  @Input() channelGroup: ChannelGroup;
  @Input() reload: Subject<boolean>;
  @Input() startdate: string;
  @Input() enddate: string;
  hasData: boolean = false;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measurementsService: MeasurementsService
  ) { }

  ngOnInit() {
    // show loading
    if (this.widget && this.widget.metrics && this.channelGroup) {
      let sub = this.getData();
      const sub1 = this.reload.subscribe(reload => {
        console.log(this.widget.metrics)
        if (reload) {
          sub = this.getData();
        }
      });
      this.subscription.add(sub);
      this.subscription.add(sub1);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    return this.measurementsService.getMeasurements(
      this.widget,
      this.channelGroup,
      this.startdate,
      this.enddate
    ).subscribe(
      response => {
        this.hasData = true;
        console.log("fire pew pew")
        this.dataUpdate.next(response);
        // hiding loading
      }
    );
  }

  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
