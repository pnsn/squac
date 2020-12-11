import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '@core/services/loading.service';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let loadingService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [
      LoadingInterceptor,
      {provide: LoadingService, useValue: {
        startLoading: () => {},
        stopLoading: () => {}
      }
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true,
      },
      ]
  }));

  beforeEach(() => {
    loadingService = TestBed.inject(LoadingService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    const interceptor: LoadingInterceptor = TestBed.inject(LoadingInterceptor);

    expect(interceptor).toBeTruthy();
  });

  it('should display loading screen for get request', () => {
    const startSpy = spyOn(loadingService, 'startLoading');

    httpClient.get('https://test.test.test/')
      .subscribe(response => {
        console.log("done")
        expect(response).toBeTruthy();
      }
    );

    expect(startSpy).toHaveBeenCalled();
  });

  it('should not display loading screen for get request in expeception list ', () => {
    const startSpy = spyOn(loadingService, 'startLoading');

    httpClient.get('https://test.test.test/measurements')
      .subscribe(response => {
        expect(response).toBeTruthy();
      }
    );

    expect(startSpy).not.toHaveBeenCalled();
  });

  it('should not display loading screen non get request', () => {
    const startSpy = spyOn(loadingService, 'startLoading');

    httpClient.delete('https://test.test.test/measurements')
      .subscribe(response => {
        expect(response).toBeTruthy();
      }
    );

    expect(startSpy).not.toHaveBeenCalled();
  });

});
