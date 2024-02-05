// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { DefaultTitleStrategy, TitleStrategy } from "@angular/router";
import { MockInstance, MockService, ngMocks } from "ng-mocks";
declare const jasmine: any;
// console.warn = (message) => {throw new Error(message)};
// ngMocks.autoSpy("jasmine");

jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

ngMocks.autoSpy("jasmine");
// // uncomment in case if existing tests are with spies already.
jasmine.getEnv().allowRespy(true);

ngMocks.config({
  onTestBedFlushNeed: "warn",
});

ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);
