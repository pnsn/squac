import { EventEmitter } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { Widget } from "@features/widgets/models/widget";

export class MockWidgetsService {
  widgetUpdated = new EventEmitter<number>();

  testWidget: Widget = new Widget(
    1,
    1,
    "name",
    "description",
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    []
  );

  getWidgets(id: number): Observable<Widget[]> {
    if (id === this.testWidget.id) {
      return of([this.testWidget]);
    } else {
      return of([]);
    }
  }

  getWidget(id: number): Observable<Widget> {
    if (id === this.testWidget.id) {
      return of(this.testWidget);
    } else {
      return throwError(() => new Error('not found'))
    }
  }

  deleteWidget(widgetId: number): Observable<any> {
    return of(true);
  }

  updateWidget(widget: Widget): Observable<any> {
    return of(widget);
  }
}
