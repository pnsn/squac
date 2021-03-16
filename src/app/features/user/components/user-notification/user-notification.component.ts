import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { UserNotification } from '@features/user/models/user-notification';
import { UserNotificationService } from '@features/user/services/user-notification.service';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {
  notificationsForm: FormGroup;
  constructor(
    private userNotificationService: UserNotificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userNotificationService.getNotifications().subscribe(n => {
      this.initForm(n);
    });
    this.notificationsForm = this.formBuilder.group({
      notifications: this.formBuilder.array([])
    });

  }

  addNotification(notification?: UserNotification) {
    this.notifications.push( this.formBuilder.group({
      type: notification ? notification.type : null,
      contact: notification ? notification.contactId : null,
      level:notification ? notification.level : null
    }));
  }

  removeNotification(index){
    console.log(index);
    this.notifications.removeAt(index);
  }

  get notifications(){
    return this.notificationsForm.get('notifications') as FormArray;
  }

  initForm(notifications: UserNotification[]) {
    notifications.forEach(notification => {
      this.addNotification(notification);
    })
  }

  saveNotifications() {

  }
}
