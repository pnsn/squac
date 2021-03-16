import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { UserContact } from '@features/user/models/user-contact';
import { UserNotification } from '@features/user/models/user-notification';
import { UserNotificationService } from '@features/user/services/user-notification.service';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss']
})
export class UserNotificationComponent implements OnInit {
  notificationsForm: FormGroup;
  contactsForm: FormGroup;
  availableContacts: UserContact[];
  constructor(
    private userNotificationService: UserNotificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userNotificationService.getNotifications().subscribe(n => {
      this.initNotificationsForm(n);
    });
    this.userNotificationService.getContacts().subscribe(c => {
      this.availableContacts = c;
      this.initContactsForm(c);
    });

    this.notificationsForm = this.formBuilder.group({
      notifications: this.formBuilder.array([])
    });
    this.contactsForm = this.formBuilder.group({
      contacts: this.formBuilder.array([])
    });
  }

  addNotification(notification?: UserNotification) {
    this.notifications.push( this.formBuilder.group({
      type: notification ? notification.type : null,
      contact: notification ? notification.contact.id : null,
      level:notification ? notification.level : null
    }));
  }

  addContact(contact?: UserContact){
    this.contacts.push( this.formBuilder.group({
      email: contact ? contact.email : null,
      sms: contact ? contact.sms : null,
      name: contact ? contact.name : null
    }));
  }

  removeNotification(index){
    console.log(index);
    this.notifications.removeAt(index);
  }

  removeContact(index) {
    this.contacts.removeAt(index);
  }

  get notifications(){
    return this.notificationsForm.get('notifications') as FormArray;
  }

  get contacts() {
    return this.contactsForm.get('contacts') as FormArray;
  }

  initNotificationsForm(notifications: UserNotification[]) {
    notifications.forEach(notification => {
      this.addNotification(notification);
    })
  }

  initContactsForm(contacts: UserContact[]) {
    contacts.forEach(contact => {
      this.addContact(contact);
    })
  }

  saveNotifications() {

  }

  saveContacts() {

  }
}
