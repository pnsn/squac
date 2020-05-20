import { AbilityBuilder, Ability } from '@casl/ability';
import { User } from './user';

export const ability = new Ability([]);

export function defineAbilitiesFor(user: User) {
  console.log(user);
  const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract();

  if (user.isAdmin()) {
    allow('manage', 'all');
  }
  if (user.inGroup('contributor')) {
    const contributorSubjects = ['Measurement', 'Metric', 'Archive'];
    allow(['update', 'delete'], contributorSubjects, {owner: user.id});
    allow(['read', 'create'], contributorSubjects);
  }
  if (user.inGroup('reporter')) {
    const reporterSubjects = ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup'];
    allow(['update', 'delete'], reporterSubjects, {owner: user.id});
    allow(['read', 'create'], reporterSubjects);
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
