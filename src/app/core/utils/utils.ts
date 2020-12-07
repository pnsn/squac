import { defer } from 'rxjs';

// App wide helper functions

// helps when testing responses to observables
export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}



