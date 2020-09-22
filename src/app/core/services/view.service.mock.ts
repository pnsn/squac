import { Subject, BehaviorSubject } from 'rxjs';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { Widget } from '@features/widgets/models/widget';

export class MockViewService {

  currentDashboard = new Subject<Dashboard>();
  currentWidgets = new Subject<Widget[]>();
  dates = new Subject<{start: Date, end: Date}>();
  resize = new Subject<number>();
  status = new Subject<string>();
  private testStartdate: Date = new Date();
  private testEnddate: Date = new Date();
  private widgets: Widget[] = [];
  error = new BehaviorSubject<string>(null);

  testDashboard: Dashboard = new Dashboard(
    1,
    1,
    'name',
    'description',
    false,
    true,
    1,
    []
  );

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

  getStartdate() {
    return this.testStartdate;
  }

  getEnddate() {
    return this.testEnddate;
  }

  resizeWidget(widgetId: number) {
    this.resize.next(widgetId);
  }

  datesChanged(start: Date, end: Date) {
    this.testStartdate = start;
    this.testEnddate = end;
    this.dates.next({
      start,
      end
    });
  }

  dashboardSelected(id, start, end) {
    this.testStartdate = start;
    this.testEnddate = end;
    this.status.next('loading');

    this.currentDashboard.next(this.testDashboard);
    this.getWidgets(this.testDashboard.id);
  }

  private widgetsChanged() {
    this.currentWidgets.next(this.widgets.slice());
    this.status.next('finished');
  }

  getWidgets(dashboardId) {
    this.status.next('loading');

    this.widgets = [this.testWidget];
    this.widgetsChanged();
  }

  updateWidget(widgetId) {
    this.status.next('loading');
    this.widgetsChanged();
  }

  addWidget(widgetId) {
    this.status.next('loading');
    this.widgetsChanged();
  }

  deleteWidget(widgetId) {
    this.status.next('loading');
    this.widgetsChanged();
  }

  // TODO: does this actuall refresh data?
  refreshWidgets() {
    console.log('refresh!');
    this.widgetsChanged();
  }

  saveDashboard(dashboard: Dashboard) {
    this.currentDashboard.next();
  }
}
