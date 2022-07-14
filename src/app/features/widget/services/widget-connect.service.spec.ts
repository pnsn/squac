import { TestBed } from '@angular/core/testing';

import { WidgetConnectService } from './widget-connect.service';

describe('WidgetConnectService', () => {
  let service: WidgetConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
