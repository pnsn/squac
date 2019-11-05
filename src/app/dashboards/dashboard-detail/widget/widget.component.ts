import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from '../../widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../../../shared/channel-group';
import { MeasurementsService } from '../../measurements.service';
import { Subscription, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { WidgetsService } from '../../widgets.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  @Input() channelGroup: ChannelGroup;
  @Input() reload: Subject<boolean>;
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

    const sub1 = this.reload.subscribe(reload => {
      if (reload) {
        this.getData();
      }
    });

    // const widgetSub = this.widgetsService.widgetUpdated.subscribe(widgetId => {
    //   this.updateWidget();

    // });

    this.subscription.add(sub1);
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
