import { Station } from './station';

describe('Station', () => {
  it('should create an instance', () => {
    expect(new Station(
      1,
      "sta",
      "station",
      "description"
    )).toBeTruthy();
  });
});
