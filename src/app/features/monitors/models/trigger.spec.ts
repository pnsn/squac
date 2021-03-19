import { TestBed } from '@angular/core/testing';
import { ApiGetTrigger, Trigger, TriggerAdapter } from './trigger';

describe('Trigger', () => {
  let adapter: TriggerAdapter;
  it('should create an instance', () => {
    expect(new Trigger(
      1,
      1,
      false,
      1,
      1,
      0,
      1
    )).toBeTruthy();
  });

  it('should adapt from api to trigger', () => {
    adapter = TestBed.inject(TriggerAdapter);

    const testData: ApiGetTrigger = {
      id: 1,
      url: 'string',
      monitor: 2,
      minval: 1,
      maxval: 1,
      band_inclusive: true,
      level: 3,
      created_at: 'string',
      updated_at: 'string',
      user_id: 'string'
    };

    const trigger = adapter.adaptFromApi(testData);
    expect(trigger).toBeDefined();
  });

  it('should adapt from trigger to api', () => {
    adapter = TestBed.inject(TriggerAdapter);
    const trigger = new Trigger(
      1,
      1,
      false,
      1,
      1,
      1,
      1
    );
    const triggerJson = adapter.adaptToApi(trigger);
    expect(triggerJson).toBeDefined();
  });

});
