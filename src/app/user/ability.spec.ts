import { TestBed, inject } from '@angular/core/testing';
import { AbilityModule } from '@casl/angular';
import { defineAbilitiesFor, AppAbility } from './ability';
import { Ability, PureAbility } from '@casl/ability';
import { User } from './user';


describe('Ability', () => {
  let testAbility: Ability;

  const testUser: User = new User(
    1,
    'email',
    'firstName',
    'lastName',
    false,
    'organization',
    []
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbilityModule],
      providers: [
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability }
      ]
    });
    testAbility = TestBed.inject(Ability);
  });

  it('should allow admin to manage all', () => {
    const adminUser = new User(
      1,
      'email',
      'firstName',
      'lastName',
      true,
      'organization',
      []
    );
    testAbility.update(defineAbilitiesFor(adminUser));
    expect(testAbility.can('manage', 'all')).toEqual(true);
  });

  it('should not allow without permission to cud', () => {
    testUser.groups = ['viewer'];

    testAbility.update(defineAbilitiesFor(testUser));
    expect(testAbility.can('update', 'Dashboard')).toEqual(false);
    expect(testAbility.can('read', 'Dashboard')).toEqual(true);
  });

  it('should allow for multiple groups', () => {
    testUser.groups = ['viewer', 'contributor'];

    testAbility.update(defineAbilitiesFor(testUser));

    expect(testAbility.can('update', 'Measurement')).toEqual(true);
    expect(testAbility.can('update', 'Widget')).toEqual(false);
  });

  it('should allow user to update own object', () => {

  });

  it('should not allow user to update not owned object', () => {

  });
});
