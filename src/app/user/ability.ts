import { AbilityBuilder, Ability } from '@casl/ability';
import { User } from './user';

export const ability = AbilityBuilder.define(can => {
  can('read', 'all');
});

export function defineAbilitiesFor(user: User) {
  const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract();

  if (user.isAdmin()) {
    allow('manage', 'all');
  }
  if (user.inGroup('contributor')) {
    allow(['update', 'delete'], ['Measurement', 'Metric', 'Archive'], {owner: user.id});
    allow(['read', 'create'], ['Measurement', 'Metric', 'Archive']);
  }
  if (user.inGroup('reporter')) {
    allow(['update', 'delete'], ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup'], {owner: user.id});
    allow(['read', 'create'], ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup']);
  }
  if (user.inGroup('viewer')) {
    allow('read', 'all');
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
