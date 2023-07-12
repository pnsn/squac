import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChannelGroupComponent } from "./pages/main/channel-group.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupViewComponent } from "./pages/list/channel-group-view.component";
import { ChannelGroupEditComponent } from "./pages/edit/channel-group-edit.component";
import { ChannelGroupDetailComponent } from "./pages/detail/channel-group-detail.component";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { MatchingRuleResolver } from "@core/resolvers/matching-rule.resolver";

export const routes: Routes = [
  {
    path: "",
    component: ChannelGroupComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "new",
        component: ChannelGroupEditComponent,
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
            component: ChannelGroupDetailComponent,
          },
          {
            path: "edit",
            component: ChannelGroupEditComponent,
          },
        ],
      },

      {
        path: "",
        resolve: {
          channelGroups: ChannelGroupResolver,
        },
        runGuardsAndResolvers: "always",
        component: ChannelGroupViewComponent,
      },
    ],
  },
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelGroupRoutingModule {}
