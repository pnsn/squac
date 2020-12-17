import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alarm } from '@features/alarms/models/alarm';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alarm-detail',
  templateUrl: './alarm-detail.component.html',
  styleUrls: ['./alarm-detail.component.scss']
})
export class AlarmDetailComponent implements OnInit {
  alarm : Alarm;
  subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        this.alarm = data.alarm;
      }
    )


    
    console.log(this.alarm)
  }

}
