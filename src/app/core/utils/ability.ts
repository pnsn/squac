import { AbilityBuilder, Ability, AbilityClass, InferSubjects } from '@casl/ability';
import { Dashboard } from 'src/app/features/dashboards/dashboard';
import { Widget } from '../models/widget';
import { Threshold } from 'src/app/features/widgets/models/threshold';
import { ChannelGroup } from '../models/channel-group';
import { Measurement } from 'src/app/features/widgets/models/measurement';
import { Metric } from '../models/metric';
import { User } from '../models/user';


type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = InferSubjects <
  typeof Dashboard |
  typeof Widget |
  typeof Threshold |
  typeof ChannelGroup |
  typeof Measurement |
  typeof Metric, true > |
  'all';
export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export function defineAbilitiesFor(user: User) {
  const { can, rules } = new AbilityBuilder(AppAbility);

  if (user.inGroup('viewer')) {
    can('read', 'all');
    can('read', 'Dashboard');
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
