import { Channel } from './channel';

describe('Channel', () => {
  it('should create an instance', () => {
    expect(new Channel(
      "EHZ",
      "ehz",
      -1,
      46.08924,
      -123.45173,
      826,
      "--",
      "Nicolai Mt., Oregon",
      "nlo",
      "uw",
      "University of Washington"
    )).toBeTruthy();
  });

  it('should have an nslc', ()=> {
    const chan = new Channel(
      "EHZ",
      "ehz",
      -1,
      46.08924,
      -123.45173,
      826,
      "--",
      "Nicolai Mt., Oregon",
      "nlo",
      "uw",
      "University of Washington"
    );

    expect(chan.nslc).toEqual('uw.nlo.--.ehz');
  })
});
