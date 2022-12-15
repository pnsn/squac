import { Observable } from "rxjs";
import { defer } from "rxjs";

/**
 * Helps when testing responses to observables
 *
 * @param data test data
 * @returns observable of test data
 */
export function fakeAsyncResponse<T>(data: T): Observable<T> {
  return defer(() => Promise.resolve(data));
}
