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

/**
 * Sort timestamps
 *
 * @param valueA string
 * @param valueB string
 *
 * @returns 1 if valueA > valueB, 0 if equal -1 if valueB > valueA
 */
export function sortTimestamps(valueA: string, valueB: string): number {
  let dateA: Date;
  let dateB: Date;
  try {
    dateA = new Date(valueA);
  } catch {
    return -1;
  }
  try {
    dateB = new Date(valueB);
  } catch {
    return 1;
  }
  if (dateA && dateB) {
    return dateA.getTime() - dateB.getTime();
  } else {
    return 0;
  }
}
