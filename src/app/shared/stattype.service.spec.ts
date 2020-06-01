import { TestBed } from '@angular/core/testing';

import { StatTypeService } from './stattype.service';

describe('StatTypeService', () => {
  let service: StatTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
