import { TestBed } from '@angular/core/testing';

import { WidgetEditService } from './widget-edit.service';

describe('WidgetEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetEditService = TestBed.inject(WidgetEditService);
    expect(service).toBeTruthy();
  });
});
