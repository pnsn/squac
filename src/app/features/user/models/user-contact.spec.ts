import { TestBed } from '@angular/core/testing';
import { ApiGetContact, ApiPostContact, UserContact, UserContactAdapter } from './user-contact';

describe('Contact', () => {
  let adapter : UserContactAdapter;
  it('should create an instance', () => {
    expect(new UserContact(
      1,
      "email",
      "sms",
      "name"
    )).toBeTruthy();
  });

  it('should adapt from api to user contact', () => {
    adapter = TestBed.inject(UserContactAdapter);
    const testData : ApiGetContact = {
      id: 1,
      url: "string",
      email_value: "string",
      sms_value: "string",
      created_at: "string",
      updated_at: "string",
      name: "name",
      user_id: "1"
    };

    let contact = adapter.adaptFromApi(testData);
    expect(contact).toBeDefined();
  });

  it('should adapt from contact to api', () => {
    adapter = TestBed.inject(UserContactAdapter);
    const contact = new UserContact(
      1,
      "email",
      "phone",
      "name"
    );
    const contactJson = adapter.adaptToApi(contact);
    expect(contactJson).toBeDefined();
  });
  
  
});
