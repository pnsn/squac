import { TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { Alert, AlertAdapter, ApiGetAlert } from './alert';
import { Trigger, TriggerAdapter } from './trigger';

fdescribe('Alert', () => {
  let adapter: AlertAdapter;
  it('should create an instance', () => {
    expect(MockService(Trigger)).toBeTruthy();
  });

  it('should adapt from api to Alert', () => {
    adapter = TestBed.inject(AlertAdapter);
    let triggerAdapter = MockService(TriggerAdapter);
    let trigger = triggerAdapter.adaptToApi(MockService(Trigger))
    
    const testData: ApiGetAlert = {
      id: 1,
      url: 'urlString',
      trigger,
      timestamp: 'string',
      message: 'string',
      in_alarm: false,
      breaching_channels: "string",
      created_at: 'string',
      updated_at: 'ng',
      user_id: '1'
    };

    const alert = adapter.adaptFromApi(testData);
    expect(alert).toBeDefined();
    expect(alert.inAlarm).toBe(false);
  });
});
