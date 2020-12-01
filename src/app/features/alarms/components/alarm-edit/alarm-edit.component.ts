import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute ,
    private userService: UserService
  ) { }

  ngOnInit() {
    // this.alarmForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   description: ['', Validators.required],
    //   shareAll: [false],
    //   shareOrg: [false]
    // });

    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = !!this.id;
        this.orgId = this.userService.userOrg;
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
      // this.alarmForm.patchValue(
      //   {
      //     name : this.alarm.name,
      //     description : this.alarm.description,
      //     shareAll: this.alarm.shareAll,
      //     shareOrg: this.alarm.shareOrg
      //   }
      // );
    }
  }
}
