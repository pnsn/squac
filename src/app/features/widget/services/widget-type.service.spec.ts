import { TestBed } from '@angular/core/testing';

import { WidgetTypeService } from './widget-type.service';

describe('WidgetTypeService', () => {
  let service: WidgetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
