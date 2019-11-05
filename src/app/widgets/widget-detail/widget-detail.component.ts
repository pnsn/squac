import { Component, OnInit, Input } from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../widgets.service';
import { MeasurementsService } from '../measurements.service';

@Component({
  selector: 'app-widget-detail',
  templateUrl: './widget-detail.component.html',
  styleUrls: ['./widget-detail.component.scss']
})
export class WidgetDetailComponent implements OnInit {

  @Input() widget: Widget;
  @Input() channelGroup: ChannelGroup;
  @Input() startdate: Date;
  @Input() enddate: Date;
  hasData = false;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  resize: Subject<boolean> = new Subject();
  //temp 

  styles : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private widgetsService: WidgetsService,
    private measurementsService: MeasurementsService
  ) { }

  ngOnInit() {
    if(this.widget) {
      this.updateWidget();
    }

    // const sub1 = this.reload.subscribe(reload => {
    //   if (reload) {
    //     this.getData();
    //   }
    // });

    // const widgetSub = this.widgetsService.widgetUpdated.subscribe(widgetId => {
    //   this.updateWidget();

    // });

    // this.subscription.add(sub1);
    // this.subscription.add(widgetSub);
    
  }

  updateWidget() {

    this.getData();
    // this.subscription.add(this.widgetsService.getWidget(this.id).subscribe(
    //   widget => {
    //     this.widget = widget;
    //     console.log("fgot widget", widget);

    //   }
    // ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    this.subscription.add(this.measurementsService.getMeasurements(
      this.widget,
      this.channelGroup,
      this.startdate,
      this.enddate
    ).subscribe(
      response => {
        this.hasData = true;
        this.dataUpdate.next(response);
        // hiding loading
      }
    ));
  }


  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
