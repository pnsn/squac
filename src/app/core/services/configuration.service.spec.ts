import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;
  const testConfig = {
    test: 'testValue',
    anotherTest: {
      test1 : 'Test2'
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the config file', () => {

    service.load().subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush(testConfig);

    httpMock.verify();
  });

  it('should return a value for key', () => {
    service.load().subscribe((res) => {

      const value = service.getValue('test');
      expect(value).toEqual('testValue');
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush(testConfig);
    httpMock.verify();
  });

  it('should return the default when the value is not found', () => {
    service.load().subscribe((res) => {

      const value = service.getValue('anything', 'defaultValue');
      expect(value).toEqual('defaultValue');
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush(testConfig);
    httpMock.verify();
  });

  it('should return undefined when the value is not found and there is no default', () => {
    service.load().subscribe((res) => {

      const value = service.getValue('anything');
      expect(value).toBeUndefined();
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toEqual('GET');
    req.flush(testConfig);
    httpMock.verify();
  });
});
