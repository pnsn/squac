import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChannelGroupComponent } from "./components/channel-group.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { ChannelGroupViewComponent } from "./components/channel-group-view/channel-group-view.component";
import { ChannelGroupEditComponent } from "./components/channel-group-edit/channel-group-edit.component";
import { ChannelGroupDetailComponent } from "./components/channel-group-detail/channel-group-detail.component";

export const routes: Routes = [
  {
    path: "",
    component: ChannelGroupComponent,
    canActivate: [AuthGuard],
    data: { subject: "ChannelGroup", action: "read" },

    children: [
      {
        path: "new",
        component: ChannelGroupEditComponent,
        canActivate: [PermissionGuard],
        data: { subject: "ChannelGroup", action: "create" },
      },
      {
        path: ":channelGroupId/edit",
        component: ChannelGroupEditComponent,
        canActivate: [PermissionGuard],
        data: { subject: "ChannelGroup", action: "update" },
      },
      {
        path: "",
        component: ChannelGroupViewComponent,
        canActivate: [PermissionGuard],
        data: { subject: "ChannelGroup", action: "read" },
        children: [
          {
            path: ":channelGroupId",
            component: ChannelGroupDetailComponent,
            canActivate: [PermissionGuard],
            data: { subject: "ChannelGroup", action: "update" },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelGroupRoutingModule {}