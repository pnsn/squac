import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupResolver } from "@core/pages/resolvers/channel-group.resolver";
import { MatchingRuleResolver } from "@core/pages/resolvers/matching-rule.resolver";

export const CHANNEL_GROUP_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/main/channel-group.component").then(
        (c) => c.ChannelGroupComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: "new",
        loadComponent: () =>
          import("./pages/edit/channel-group-edit.component").then(
            (c) => c.ChannelGroupEditComponent
          ),
      },

      {
        path: ":channelGroupId",
        runGuardsAndResolvers: "always",
        resolve: {
          channelGroup: ChannelGroupResolver,
          matchingRules: MatchingRuleResolver,
        },
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./pages/detail/channel-group-detail.component").then(
                (c) => c.ChannelGroupDetailComponent
              ),
          },
          {
            path: "edit",
            loadComponent: () =>
              import("./pages/edit/channel-group-edit.component").then(
                (c) => c.ChannelGroupEditComponent
              ),
          },
        ],
      },

      {
        path: "",
        resolve: {
          channelGroups: ChannelGroupResolver,
        },
        runGuardsAndResolvers: "always",
        loadComponent: () =>
          import("./pages/list/channel-group-view.component").then(
            (c) => c.ChannelGroupViewComponent
          ),
      },
    ],
  },
];
