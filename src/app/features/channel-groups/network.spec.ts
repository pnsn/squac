import { Network } from './network';

describe('Network', () => {
  it('should create an instance', () => {
    expect(new Network(
      1,
      'code',
      'name',
      'description'
    )).toBeTruthy();
  });
});
