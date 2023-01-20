import {
  AbilityBuilder,
  Ability,
  AbilityClass,
  InferSubjects,
} from "@casl/ability";
import { Widget } from "widgets";
import { ChannelGroup } from "squacapi";
import { Metric } from "squacapi";
import { User } from "squacapi";
import { Dashboard } from "squacapi";
import { Measurement } from "squacapi";
import { Monitor } from "squacapi";

// class for handling permissions, see Angular CASL for more info
type Actions = "create" | "read" | "update" | "delete" | "manage";

/** Subjects for abilities */
type Subjects =
  | InferSubjects<
      | typeof Dashboard
      | typeof Widget
      | typeof ChannelGroup
      | typeof Measurement
      | typeof Metric
      | typeof Monitor,
      true
    >
  | "all";

export type AppAbility = Ability<[Actions, Subjects]>;
/** App Ability permissions */
export const AppAbility = Ability as AbilityClass<AppAbility>;

/**
 * Defines ability for a given user
 *
 * @param user current user
 * @returns permissions
 */
export function defineAbilitiesFor(user: User): any {
  console.log(user.groups);
  const { can, rules } = new AbilityBuilder(AppAbility);
  can("read", "all");
  if (user.inGroup("viewer")) {
    can("read", "Dashboard");
  }

  if (user.inGroup("reporter")) {
    can(
      ["update", "delete"],
      ["Dashboard", "Widget", "ChannelGroup", "Monitor"],
      { owner: user.id }
    );
    can(["read", "create"], ["Dashboard", "Widget", "ChannelGroup", "Monitor"]);
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
