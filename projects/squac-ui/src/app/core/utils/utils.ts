import { Observable } from "rxjs";
import { defer } from "rxjs";

// helps when testing responses to observables
/**
 *
 * @param data
 */
export function fakeAsyncResponse<T>(data: T): Observable<T> {
  return defer(() => Promise.resolve(data));
}
