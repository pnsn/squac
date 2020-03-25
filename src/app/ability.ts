import { AbilityBuilder, Ability } from '@casl/ability';
import { User } from './auth/user';

export function defineAbilitiesFor(user : User) {
  const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract()

  if (user.isAdmin()) {
    allow('manage', 'all')
  } 
  if (user.inGroup('viewer')) {
    allow('read', 'all')
  }
  if (user.inGroup('reporter')) {
    allow('crud', 'dashboards')
    allow('crud', 'widgets')
    allow('crud', 'groups')
  }
  if(user.inGroup('contributor')) {
    allow('crud', 'measurements')
    allow('crud', 'metrics')
    allow('crud', 'archive')
  }

  return rules;
}

//TODO: deal with ownership

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