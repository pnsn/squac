import { Widget } from './widget';

describe('Widget', () => {
  it('should create an instance', () => {
    expect(new Widget(1, 'name', 'description', 1, 1, 1, 1, 1, 1, 1, [])).toBeTruthy();
  });
});
