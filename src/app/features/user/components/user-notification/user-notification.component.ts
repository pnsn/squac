import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '@core/services/message.service';
import { UserContact, UserContactAdapter } from '@features/user/models/user-contact';
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
  availableContacts: UserContact[] = [];

  constructor(
    private userNotificationService: UserNotificationService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userNotificationService.getContacts().subscribe(c => {
      this.availableContacts = c;
      this.initContactsForm(c);
    });

    this.userNotificationService.getNotifications().subscribe(n => {
      this.initNotificationsForm(n);
    });

    this.notificationsForm = this.formBuilder.group({
      notifications: this.formBuilder.array([])
    });
    this.contactsForm = this.formBuilder.group({
      contacts: this.formBuilder.array([])
    });
  }

  addNotification(notification?: UserNotification) {
    let contact;
    if (notification && notification.contact.id) {
      contact = this.availableContacts.find(c => c.id === notification.contact.id);
    }
    this.notifications.push( this.formBuilder.group({
      type: notification ? notification.type : null,
      contact: contact ? contact : null,
      level: notification ? notification.level : null,
      id: notification ? notification.id : null
    }));
  }

  addContact(contact?: UserContact){
    this.contacts.push( this.formBuilder.group({
      email: contact ? contact.email : null,
      sms: contact ? contact.sms : null,
      name: contact ? contact.name : null,
      id: contact ? contact.id : null
    }));
  }

  removeNotification(index){
    const notification = this.notificationsForm.value.notifications[index];
    this.notifications.removeAt(index);
    if (notification.id) {
      this.userNotificationService.deleteNotification(notification.id).subscribe(
        n => {}
      );
    }

  }

  removeContact(index) {
    const contact = this.contactsForm.value.contacts[index];
    this.contacts.removeAt(index);
    if (contact.id) {
      this.userNotificationService.deleteContact(contact.id).subscribe(
        c => {
          this.updateAvailableContacts(c.id, c);
        }
      );
    }
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
    });
  }

  initContactsForm(contacts: UserContact[]) {
    contacts.forEach(contact => {
      this.addContact(contact);
    });
  }

  saveNotification(i) {
    const notification = this.notificationsForm.value.notifications[i];
    this.userNotificationService.updateNotification(notification).subscribe(
      n => {},
      error => {
        this.messageService.error('Could not save notification.');
      }
    );
  }

  updateAvailableContacts(contactId: number, contact?: UserContact) {
    const index = this.availableContacts.findIndex(c => c.id === contactId);
    if (index > -1) {
      if (contact) {
        this.availableContacts[index] = contact;
      } else {
        this.availableContacts.splice(index, 1 );
      }
    } else {
      this.availableContacts.push(contact);
    }
  }

  saveContact(i) {
    const contact = this.contactsForm.value.contacts[i];
    this.userNotificationService.updateContact(contact).subscribe(
      c => {
        this.updateAvailableContacts(c.id, c);
      },
      error => {
        this.messageService.error('Could not save contact.');
      }
    );
  }
}
