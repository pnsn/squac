import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MonitorsService } from './monitors.service';

describe('MonitorsService', () => {
  let service: MonitorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MonitorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all monitors', () => {

  });

  it('should get monitor with id', () => {

  });

  it('should put monitor without id', () => {

  });

  it('should post monitor with id', () => {

  });


});
