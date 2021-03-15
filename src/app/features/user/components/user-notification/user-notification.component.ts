import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {
  contact = {
    id: 1,
    email: "email@email.org",
    phone: "1111111111"
  };

  constructor() { }

  ngOnInit(): void {
  }

}
