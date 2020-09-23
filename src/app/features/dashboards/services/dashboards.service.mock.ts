import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Dashboard } from '../models/dashboard';

export class MockDashboardsService {

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
  getDashboards(): Observable<Dashboard[]> {
    return of([this.testDashboard]);
  }

  getDashboard(id: number): Observable<Dashboard> {
    if ( id === this.testDashboard.id) {
      return of(this.testDashboard);
    } else {
      return throwError('not found');
    }
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return of(dashboard);
  }

  deleteDashboard(dashboardId: number) {
    return of();
  }
}
