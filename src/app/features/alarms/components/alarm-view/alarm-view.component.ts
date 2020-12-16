import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alarm } from '@features/alarms/models/alarm';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-alarm-view',
  templateUrl: './alarm-view.component.html',
  styleUrls: ['./alarm-view.component.scss']
})
export class AlarmViewComponent implements OnInit {
  alarms: Alarm[];
  constructor(
    private route: ActivatedRoute
  ) { }

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  ngOnInit(): void {
    this.alarms = this.route.parent.snapshot.data.alarms;
  }

}
