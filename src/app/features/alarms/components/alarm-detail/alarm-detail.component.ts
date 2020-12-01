import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alarm } from '@features/alarms/models/alarm';

@Component({
  selector: 'app-alarm-detail',
  templateUrl: './alarm-detail.component.html',
  styleUrls: ['./alarm-detail.component.scss']
})
export class AlarmDetailComponent implements OnInit {
  alarm : Alarm;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.alarm = this.route.snapshot.data.alarm;
  }

}
