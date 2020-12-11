import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationEnd, Params } from '@angular/router';
import { Alarm } from '@features/alarms/models/alarm';
import { UserService } from '@features/user/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alarm-edit',
  templateUrl: './alarm-edit.component.html',
  styleUrls: ['./alarm-edit.component.scss']
})
export class AlarmEditComponent implements OnInit {
  subscriptions : Subscription = new Subscription();
  id: number;
  editMode:boolean;
  orgId: number;
  alarm: Alarm;
  alarmForm: FormGroup;
  constructor(
    private route: ActivatedRoute ,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.alarmForm = this.formBuilder.group({
      name: ['', Validators.required],
      intervalType: ['', Validators.required],
      intervalCount: ['', Validators.required],
      numberChannels: ['', Validators.required],
      stat: ['', Validators.required]
    });

    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = !!this.id;
        this.initForm();
      },
      error => {
        console.log('error getting params: ' + error);
      }
    );

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {

    if (this.editMode) {
      this.alarm = this.route.snapshot.data.alarm;
      this.alarmForm.patchValue(
        {
          name: this.alarm.name,
          intervalType: this.alarm.intervalType,
          intervalCount: this.alarm.intervalCount,
          numberChannels: this.alarm.numberChannels,
          stat: this.alarm.stat
        }
      );
    }
  }
}
