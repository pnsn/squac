import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../widgets.service';
import { MeasurementsService } from '../measurements.service';
import { ViewService } from 'src/app/shared/view.service';
import { DataFormatService } from '../data-format.service';

@Component({
  selector: 'app-widget-detail',
  templateUrl: './widget-detail.component.html',
  styleUrls: ['./widget-detail.component.scss'],
  providers: [DataFormatService]
})
export class WidgetDetailComponent implements OnInit, OnDestroy {

  @Input() widget: Widget;
  channelGroup: ChannelGroup;
  data : any;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  resize: Subject<boolean> = new Subject();
  // temp

  styles: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService : ViewService,
    private dataFormatService : DataFormatService
  ) { }

  ngOnInit() {

    //listed to changes and detch when needed
    this.channelGroup = this.viewService.getChannelGroup();
    this.dataFormatService.fetchData(this.widget);

    this.viewService.dates.subscribe(
      dates => {
        console.log("new dates")
        this.dataFormatService.fetchData(this.widget);
      }
    )
    //widget data errors here

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
