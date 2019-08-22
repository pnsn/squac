import { Channel } from './channel';

describe('Channel', () => {
  it('should create an instance', () => {
    expect(new Channel(
      1,
      "EHZ",
      "ehz",
      -1,
      46.08924,
      -123.45173,
      826,
      "--"
    )).toBeTruthy();
  });

  it('should have an nslc', ()=> {
    const chan = new Channel(
      1,
      "EHZ",
      "ehz",
      -1,
      46.08924,
      -123.45173,
      826,
      "--"
    );

    expect(chan.nslc).toEqual('uw.nlo.--.ehz');
  })
});
