import { TestBed } from '@angular/core/testing';
import { Alert, AlertAdapter, ApiGetAlert } from './alert';

describe('Alert', () => {
  let adapter : AlertAdapter;
  it('should create an instance', () => {
    expect(new Alert(
      1,
      1,
      'timestamp',
      'message',
      false,
      null
    )).toBeTruthy();
  });

  it('should adapt from api to Alert', ()=> {
    adapter=TestBed.inject(AlertAdapter);
    const testData : ApiGetAlert = {
      id: 1,
      url: "urlString",
      trigger: {
        id: 1,
        url: "string",
        monitor: 1,
        minval: 1,
        maxval: 2,
        band_inclusive: false,
        level: 1,
        created_at: "string",
        updated_at: "string",
        user_id: "1"
      },
      timestamp: "string",
      message: "string",
      in_alarm: false,
      created_at: "string",
      updated_at: "ng",
      user_id: "1"
    }

    const alert = adapter.adaptFromApi(testData);
    expect(alert).toBeDefined();
    expect(alert.inAlarm).toBe(false);
  });
});
