import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';
import { User } from './user';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Dashboard' | 'Widget' | 'Threshold' | 'ChannelGroup' | 'Measurement' | 'Metric' | 'Archive' | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export function defineAbilitiesFor(user: User) {
  const { can, rules } = new AbilityBuilder(AppAbility);
  
  if (user.inGroup('viewer')) {
    can('read', 'all');
  }

  if (user.inGroup('reporter')) {
    can(['update', 'delete'], ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup'], {owner: user.id});
    can(['read', 'create'], ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup']);
  }

  if (user.inGroup('contributor')) {
    can(['update', 'delete'], ['Measurement', 'Metric', 'Archive'], {owner: user.id});
    can(['read', 'create'], ['Measurement', 'Metric', 'Archive']);
  }

  if (user.isAdmin()) {
    can('manage', 'all');
  }
  
  return rules;

}
// TODO: deal with ownership

// Viewers
// see all resources
// can('read', 'all')


// Reporters
// + Viewer
// crud own groups, dashboards, widgets
// can('crud', groups/dashboards/widgets, if owned)

// Contributor
// + Reporter
// crud measurement, metric, archive
// can('crud', measurements, metrics, archive, if owned)

// Admin => is_staff = true
// + Contributer
// Everything
