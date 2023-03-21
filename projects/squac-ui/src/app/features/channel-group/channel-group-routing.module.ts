import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChannelGroupComponent } from "./components/channel-group.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupViewComponent } from "./components/channel-group-view/channel-group-view.component";
import { ChannelGroupEditComponent } from "./components/channel-group-edit/channel-group-edit.component";
import { ChannelGroupDetailComponent } from "./components/channel-group-detail/channel-group-detail.component";

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
