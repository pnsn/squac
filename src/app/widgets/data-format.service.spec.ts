import { TestBed } from '@angular/core/testing';

import { DataFormatService } from './data-format.service';
import { ViewService } from '../shared/view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataFormatService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataFormatService]
    });
  });
  it('should be created', () => {
    const service: DataFormatService = TestBed.get(DataFormatService);
    expect(service).toBeTruthy();
  });
});
