import { AbilityBuilder, Ability } from '@casl/ability';
import { User } from './user';

export const ability = new Ability([]);

export function defineAbilitiesFor(user: User) {
  const { rules, can, cannot } = AbilityBuilder.extract();
  
  if (user.inGroup('viewer')) {
    can('read', 'all');
  }

  if (user.inGroup('reporter')) {
    const reporterSubjects = ['Dashboard', 'Widget', 'Threshold', 'ChannelGroup'];
    can(['update', 'delete'], reporterSubjects, {owner: user.id});
    can(['read', 'create'], reporterSubjects);
  }

  if (user.inGroup('contributor')) {
    const contributorSubjects = ['Measurement', 'Metric', 'Archive'];
    can(['update', 'delete'], contributorSubjects, {owner: user.id});
    can(['read', 'create'], contributorSubjects);
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
