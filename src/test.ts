// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import {ngMocks} from 'ng-mocks';

declare const require: any;
// console.warn = (message) => {throw new Error(message)};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

ngMocks.autoSpy('jasmine'); // or jest

// ngMocks.defaultMock helps to customize mocks
// globally. Therefore, we can avoid copy-pasting
// among tests.
// https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
// ngMocks.defaultMock(AuthService, () => ({
//   isLoggedIn$: EMPTY,
//   currentUser$: EMPTY,
// }));
