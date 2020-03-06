import { AbilityBuilder } from '@casl/ability'
 
export const ability = AbilityBuilder.define(can => {
  can('read', 'all')
})


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
