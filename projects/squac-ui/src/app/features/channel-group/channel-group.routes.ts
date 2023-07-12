import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChannelGroupComponent } from "./pages/main/channel-group.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupViewComponent } from "./pages/list/channel-group-view.component";
import { ChannelGroupEditComponent } from "./pages/edit/channel-group-edit.component";
import { ChannelGroupDetailComponent } from "./pages/detail/channel-group-detail.component";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { MatchingRuleResolver } from "@core/resolvers/matching-rule.resolver";

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
