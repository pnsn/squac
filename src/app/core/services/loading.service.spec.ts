import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should set status of loading screen", () => {
    service.setStatus("test")
    service.loadingStatus.subscribe(
        status => {
          expect(status).toBe("test");
        }
    )
  });

  it('should start loading', () => {
    service.startLoading();
    service.loading.subscribe(
        loading => {
          expect(loading).toEqual(true);
        }
    )
  });

  it('should stop loading', () => {
    service.startLoading();
    service.stopLoading();
    service.loading.subscribe(
        loading => {
          expect(loading).toEqual(false);
        }
    )
  });

  it('should empty status', () => {
    service.startLoading();
    service.stopLoading();
    service.loadingStatus.subscribe(
        status => {
          expect(status).toBeNull();
        }
    )
  });

});
