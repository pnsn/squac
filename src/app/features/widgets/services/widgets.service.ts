import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import {
  ApiPostWidget,
  Widget,
  WidgetAdapter,
} from "@features/widgets/models/widget";
import { catchError, map, switchMap } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";
import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";
import { ChannelGroup } from "@core/models/channel-group";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetsService {
  private url = "dashboard/widgets/";

  constructor(
    private squacApi: SquacApiService,
    private channelGroupsService: ChannelGroupsService,
    private widgetAdapter: WidgetAdapter
  ) {}

  getWidgets(dashboardId: number): Observable<Widget[]> {
    const widgets: Widget[] = [];
    return this.squacApi
      .get(this.url, null, {
        dashboard: dashboardId,
      })
      .pipe(
        switchMap((response) => {
          let cGRequests = [];
          response.forEach((w) => {
            widgets.push(this.widgetAdapter.adaptFromApi(w));
            if (cGRequests.indexOf(w.channel_group) < 0) {
              cGRequests.push(w.channel_group);
            }
          });

          cGRequests = cGRequests.map((id) => {
            return this.channelGroupsService.getChannelGroup(id).pipe(
              catchError((err) => {
                console.log(id, err);
                return of(id);
              })
            );
          });
          return cGRequests.length > 0 ? forkJoin(cGRequests) : of([]);
        }),
        map((channelGroups: any) => {
          widgets.forEach((w) => {
            w.channelGroup = channelGroups.find((cg: ChannelGroup) => {
              return cg.id === w.channelGroupId;
            });
          });
          return widgets;
        })
      );
  }

  getWidget(id: number): Observable<Widget> {
    let widget: Widget;
    return this.squacApi.get(this.url, id).pipe(
      switchMap((response) => {
        widget = this.widgetAdapter.adaptFromApi(response);
        return this.channelGroupsService.getChannelGroup(widget.channelGroupId);
      }),
      map((channelGroup) => {
        widget.channelGroup = channelGroup;
        return widget;
      })
    );
  }

  // Post and put for widget don't return serialized values
  updateWidget(widget: Widget): Observable<any> {
    const postData: ApiPostWidget = this.widgetAdapter.adaptToApi(widget);
    if (widget.id) {
      return this.squacApi.put(this.url, widget.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteWidget(widgetId): Observable<any> {
    return this.squacApi.delete(this.url, widgetId);
  }
}
