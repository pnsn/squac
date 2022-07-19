import { Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { ApiPostWidget, Widget, WidgetAdapter } from "@widget/models/widget";
import { catchError, map, switchMap } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService {
  private url = "dashboard/widgets/";

  constructor(
    private squacApi: SquacApiService,
    private widgetAdapter: WidgetAdapter
  ) {}

  // get all widgets for dashboard
  getWidgets(dashboardId: number): Observable<Widget[]> {
    return this.squacApi
      .get(this.url, null, {
        dashboard: dashboardId,
      })
      .pipe(
        map((response: any) => {
          const widgets = [];
          response.forEach((w) => {
            widgets.push(this.widgetAdapter.adaptFromApi(w));
          });
          return widgets;
        })
      );
  }

  // get individual widget
  getWidget(id: number): Observable<Widget> {
    return this.squacApi.get(this.url, id).pipe(
      map((response) => {
        return this.widgetAdapter.adaptFromApi(response);
      })
    );
  }

  // Post and put for widget don't return serialized values
  updateWidget(widget: Widget): Observable<any> {
    const postData: any = this.widgetAdapter.adaptToApi(widget);
    postData.channel_group = 1;
    if (widget.id) {
      return this.squacApi.put(this.url, widget.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  // delete widget
  deleteWidget(widgetId): Observable<any> {
    return this.squacApi.delete(this.url, widgetId);
  }
}
