import { TestBed } from '@angular/core/testing';
import { ApiGetChannel, Channel, ChannelAdapter } from './channel';

describe('Channel', () => {
  let adapter: ChannelAdapter;
  it('should create an instance', () => {
    expect(new Channel(
      1,
      'ehz',
      'EHZ',
      -1,
      46.08924,
      -123.45173,
      826,
      '--',
      '',
      ''
    )).toBeTruthy();
  });

  it('should have an nslc', () => {
    const chan = new Channel(
      1,
      'ehz',
      'EHZ',
      -1,
      46.08924,
      -123.45173,
      826,
      '--',
      'nlo',
      'uw'
    );

    expect(chan.nslc).toEqual('uw.nlo.--.ehz');
  });

  it('should create new channel from api json', () => {
    adapter = TestBed.inject(ChannelAdapter);
    const testData: ApiGetChannel = {
      id: 1,
      class_name: 'string',
      code: 'code',
      name: 'name',
      station_code: 'string',
      station_name: 'string',
      url: 'string',
      description: 'string',
      sample_rate: 1,
      network: 'string',
      loc: 'string',
      lat: 2,
      lon: 2,
      elev: 2,
      azimuth: 2,
      dip: 1,
      created_at: 'string',
      updated_at: 'string',
      user_id: 'string',
      starttime: 'string',
      endtime: 'string'
    };
    const channel = adapter.adaptFromApi(testData);
    expect(channel).toBeDefined();
    expect(channel.id).toBe(1);
  });

});
