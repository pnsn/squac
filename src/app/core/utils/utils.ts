import { defer } from "rxjs";

// helps when testing responses to observables
export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
