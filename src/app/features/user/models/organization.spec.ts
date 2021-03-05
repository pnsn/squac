import { Organization } from './organization';

describe('Organization', () => {
  it('should create an instance', () => {
    expect(new Organization(1, '', '', [])).toBeTruthy();
  });
});
