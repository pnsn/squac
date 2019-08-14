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
});
