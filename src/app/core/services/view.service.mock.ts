import { Subject, BehaviorSubject } from 'rxjs';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { Widget } from '@features/widgets/models/widget';

export class MockViewService {

  currentDashboard = new Subject<Dashboard>();
  currentWidgets = new Subject<Widget[]>();
  dates = new Subject<{start: Date, end: Date}>();
  resize = new Subject<number>();
  refresh = new Subject<string>();
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

  get canUpdate(): boolean {
    return false;
  }

  get isLive(): boolean {
    return false;
  }

  getRange(): number {
    return 1;
  }

  getStartdate(): string {
    return '';
  }

  getEnddate(): string {
    return '';
  }

  resizeWidget(widgetId: number) {
    this.resize.next(widgetId);
  }

  setWidgets(widgets: Widget[]): void {
    this.widgets = widgets;
  }

  getWidget(id: number ): Widget | boolean {
    return id === this.testWidget.id ? this.testWidget : false;
  }

  widgetFinishedLoading() {
    this.status.next('stop');
  }

  widgetStartedLoading() {
    this.status.next('start');
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
  }

  private widgetsChanged() {
    this.currentWidgets.next(this.widgets.slice());
    this.status.next('finished');
  }

  updateWidget(widgetId) {
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
    this.currentDashboard.next(dashboard);
  }

  deleteDashboard() {
    this.currentDashboard.next();
  }
}
