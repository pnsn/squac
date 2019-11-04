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
  columnWidth = 100;
  rowHeight = 100;

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
    this.styles = {
      "width.px" : this.widget.columns * this.columnWidth,
      "height.px" : this.widget.rows * this.rowHeight,
      "order": this.widget.order
    }
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

  onResizeEnd(event: ResizeEvent): void {
    const row = Math.round(event.rectangle.height / this.rowHeight);
    const column = Math.round(event.rectangle.width / this.columnWidth);


    this.widget.rows = row > 0 ? row : 1;
    this.widget.columns = column > 0 ? column : 1;

    this.styles = {
      "width.px" : this.widget.columns * this.columnWidth,
      "height.px" : this.widget.rows * this.rowHeight,
      "order": this.widget.order
    };

    this.widgetsService.updateWidget(this.widget).subscribe();
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'))
    }, 100);
  }

  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
