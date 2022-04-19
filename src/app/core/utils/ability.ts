import {
  AbilityBuilder,
  Ability,
  AbilityClass,
  InferSubjects,
} from "@casl/ability";
import { Widget } from "@features/widgets/models/widget";
import { ChannelGroup } from "../models/channel-group";
import { Metric } from "../models/metric";
import { User } from "@features/user/models/user";
import { Dashboard } from "@features/dashboards/models/dashboard";
import { Threshold } from "@features/widgets/models/threshold";
import { Measurement } from "@features/widgets/models/measurement";
import { Monitor } from "@features/monitors/models/monitor";

type Actions = "create" | "read" | "update" | "delete" | "manage";
type Subjects =
  | InferSubjects<
      | typeof Dashboard
      | typeof Widget
      | typeof Threshold
      | typeof ChannelGroup
      | typeof Measurement
      | typeof Metric
      | typeof Monitor,
      true
    >
  | "all";
export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export function defineAbilitiesFor(user: User) {
  const { can, rules } = new AbilityBuilder(AppAbility);
  can("read", "all");
  if (user.inGroup("viewer")) {
    can("read", "Dashboard");
  }

  if (user.inGroup("reporter")) {
    can(
      ["update", "delete"],
      ["Dashboard", "Widget", "Threshold", "ChannelGroup", "Monitor"],
      { owner: user.id }
    );
    can(
      ["read", "create"],
      ["Dashboard", "Widget", "Threshold", "ChannelGroup", "Monitor"]
    );
  }

  if (user.inGroup("contributor")) {
    can(["update", "delete"], ["Measurement", "Metric", "Archive"], {
      owner: user.id,
    });
    can(["read", "create"], ["Measurement", "Metric", "Archive"]);
  }

  if (user.isStaff) {
    can("manage", "all");
  }

  return rules;
}
// TODO: deal with organizations

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
