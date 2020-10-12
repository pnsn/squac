import { TestBed } from '@angular/core/testing';

import { ViewService } from './view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { MockDashboardsService } from '@features/dashboards/services/dashboards.service.mock';
import { MockWidgetsService } from '@features/widgets/services/widgets.service.mock';
import { WidgetsService } from '@features/widgets/services/widgets.service';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';

describe('ViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AbilityModule],
      providers: [{
        provide: DashboardsService, useClass: MockDashboardsService,
      },
      {provide: WidgetsService, useClass: MockWidgetsService},
      { provide: Ability, useValue: new Ability()}
    ]
    });


  });
  it('should be created', () => {
    const service: ViewService = TestBed.inject(ViewService);
    expect(service).toBeTruthy();
  });
});
