import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AlarmsService } from './alarms.service';

describe('AlarmsService', () => {
  let service: AlarmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AlarmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all alarms', () => {

  });

  it('should get alarm with id', () => {

  });

  it('should put alarm without id', () => {

  });

  it('should post alarm with id', () => {

  });

  
});
