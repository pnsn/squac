import { Network } from './network';

describe('Network', () => {
  it('should create an instance', () => {
    expect(new Network(
      'code',
      'name',
      'description'
    )).toBeTruthy();
  });
});
