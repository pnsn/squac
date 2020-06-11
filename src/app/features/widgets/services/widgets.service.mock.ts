import { EventEmitter } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Widget } from '../../core/models/widget';


export class MockWidgetsService {
  widgetUpdated = new EventEmitter<number>();

  testWidget: Widget = new Widget(
    1,
    1,
    'name',
    'description',
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    []
  );

  getWidgetsByDashboardId(id: number): Observable<Widget[]> {
    if ( id === this.testWidget.id) {
      return of([this.testWidget]);
    } else {
      return of([]);
    }
  }

  getWidget(id: number): Observable<Widget> {
    if ( id === this.testWidget.id) {
      return of(this.testWidget);
    } else {
      return throwError('not found');
    }
  }


  updateWidget(widget: Widget): Observable<any> {
    return of(this.testWidget);
  }

  deleteWidget(widgetId): Observable<any> {
    return of(this.testWidget);
  }

}
