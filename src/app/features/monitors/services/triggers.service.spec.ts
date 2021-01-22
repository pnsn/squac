import { TestBed } from '@angular/core/testing';

import { TriggersService } from './triggers.service';

describe('TriggersService', () => {
  let service: TriggersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriggersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get triggers for monitor id', () => {

  });

  it('should update triggers, put without id', () => {

  });

  it('should update triggers, post with id', () => {

  });

  
});
