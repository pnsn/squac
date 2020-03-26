import { ChannelGroup } from './channel-group';

describe('ChannelGroup', () => {
  it('should create an instance', () => {
    expect(new ChannelGroup(
      1,
      1,
      'test',
      'description',
      []
    )).toBeTruthy();
  });
});
