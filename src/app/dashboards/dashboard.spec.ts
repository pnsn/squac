import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  it('should create an instance', () => {
    expect(new Dashboard(1, 1, 'Test', 'description', [])).toBeTruthy();
  });
});
