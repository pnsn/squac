import { AbilityBuilder, Ability } from '@casl/ability';
import { User } from './auth/user';

export const ability = AbilityBuilder.define(can => {
  can('read', 'all');
});

export function defineAbilitiesFor(user : User) {
  const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract()

  if (user.isAdmin()) {
    allow('manage', 'all')
  } 
  if(user.inGroup('contributor')) {
    allow('crud', 'Measurement', {owner: user.id})
    allow('crud', 'Metric', {owner: user.id})
    allow('crud', 'Archive', {owner: user.id})
  }
  if (user.inGroup('reporter')) {
    allow('crud', 'Dashboard', {owner: user.id})
    allow('crud', 'Widget', {owner: user.id})
    allow('crud', 'ChannelGroup', {owner: user.id})
    allow('crud', 'Threshold', {owner: user.id})
  }
  if (user.inGroup('viewer')) {
    allow('read', 'all')
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