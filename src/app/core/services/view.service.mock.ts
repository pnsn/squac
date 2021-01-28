import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Dashboard } from '@features/dashboards/models/dashboard';
import { Widget } from '@features/widgets/models/widget';

export class MockViewService{
  currentWidgets = new Subject<Widget[]>();
  dates = new ReplaySubject<number>(1);
  resize = new Subject<number>();
  refresh = new Subject<string>();
  status = new BehaviorSubject<string>('loading'); // loading, error, finished
  error = new BehaviorSubject<string>(null);
  private live: boolean;
  // refresh = new Subject<number>();
  private dashboard: Dashboard;
  private dateRanges;
  queuedWidgets = 0;
  locale;
  defaultTimeRange;


  // Services used by ViewService
  dashboardService;
  widgetService;
  messageService;
  ability;
  configservice;
  mesageService;

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

  private getWidgetIndexById(id: number): number {
    return this.dashboard.widgets.findIndex(w => w.id === id);
  }
  private setIntialDates() {}
  private widgetChanged(widgetId: number): void {}

  resizeAll() {
    this.resize.next(null);
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
    this.testDashboard.widgets = widgets;
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

  datesChanged(start, end) {
    this.dates.next(this.dashboard.id);
  }

  setDashboard(dashboard: Dashboard) {
     this.dashboard = dashboard;
  }

  private widgetsChanged() {
    if (this.dashboard) {
      this.currentWidgets.next(this.dashboard.widgets.slice());

    }
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

    this.widgetsChanged();
  }

  saveDashboard() {
    this.dashboard = this.dashboard;
  }

  deleteDashboard() {
    this.dashboard = null;
  }
}
