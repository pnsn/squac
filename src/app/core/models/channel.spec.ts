import { Channel } from './channel';

describe('Channel', () => {
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
});
