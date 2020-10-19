import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WidgetsService } from './services/widgets.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetsResolver implements Resolve<Observable<any>> {
  constructor(private widgetsService: WidgetsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dashboardId = +route.parent.paramMap.get('id');
    const widgetId = +route.paramMap.get('widgetid');

    if (widgetId) {
      return this.widgetsService.getWidget(widgetId).pipe(
        tap(data => {
          console.log('in resolver, widget');
        }),
        catchError(this.handleError)
      );
    } else {
      return this.widgetsService.getWidgets(dashboardId).pipe(
        tap(data => {
          console.log('in resolver, widgets');
        }),
        catchError(this.handleError)
      );
      // return all of them
    } 
  }

  handleError(error): Observable<any> {
    console.log("widget error", error)
    // TODO: route to show error
    return of({ error });
  }

}
