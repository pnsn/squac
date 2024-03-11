import { Observable, OperatorFunction, tap, timer } from "rxjs";
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

/**
 * Pipeable operator that executes a function if the observable has not finished
 * by the delay time
 *
 * @param fn function to execute
 * @param delay amount of ms to wait
 * @param _thisArg ?
 * @returns Given observable
 * @example
 * obs$.pipe(
    executeDelayed(() => {
       this.startLoading(context, loaderId);
      }, 1000),
 * )
 */
export function executeDelayed<T>(
  fn: () => void,
  delay: number,
  _thisArg?: any
): OperatorFunction<T, T> {
  return function executeDelayedOperation(
    source: Observable<T>
  ): Observable<T> {
    let timerSub = timer(delay).subscribe(() => fn());
    return source.pipe(
      tap({
        next: () => {
          timerSub.unsubscribe();
          timerSub = timer(delay).subscribe(() => fn());
        },
        error: () => timerSub.unsubscribe(), // unsubscribe on error
        complete: () => timerSub.unsubscribe(),
      })
    );
  };
}

/**
 * Custom data accessor for MatSort directive for nested properties
 *
 * @param item data item to sort, usually a row in the table
 * @param property name of property to access, with dot notation for nested
 * @returns property of the data
 */
export function nestedPropertyDataAccessor<T>(
  item: T,
  property: string
): string | number {
  if (property.includes("."))
    return property.split(".").reduce((o, i) => o[i], item);
  return item[property];
}
