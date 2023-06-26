import { Injectable, NgZone } from "@angular/core";
import { executeDelayed } from "@core/utils/utils";
import { asyncScheduler, BehaviorSubject, Observable } from "rxjs";
import { finalize, observeOn } from "rxjs/operators";

type LoadingContext = object;
type LoaderId = string | number; // expected enum values
/** default loading id */
const DEFAULT_LOADER_ID: LoaderId = "_DEFAULT";
/** default loading context */
const DEFAULT_CONTEXT: LoadingContext = { _DEFAULT: true };

/**
 * I got this from the internet...
 * Used for centrally setting/unsetting loading flags for components or services.
 * Should be connected to global HTTP interceptor which will unset
 * the loading flags in case an error happens using the clearLoadings() method.
 */
@Injectable({
  providedIn: "root",
})
export class LoadingService {
  // WeakMap will remove components from itself upon
  // their garbage collection by JS runtime.
  protected loadingStates = new WeakMap<
    LoadingContext,
    Map<LoaderId, boolean>
  >();
  // Both loading state maps are kept in-sync such that
  // they can be used by both sync and async methods.
  protected loadingStates$ = new WeakMap<
    LoadingContext,
    Map<LoaderId, BehaviorSubject<boolean>>
  >();

  constructor(protected zoneRef: NgZone) {}

  /**
   * Observable creation operator, use to start loading with an observable
   * LoaderId can be used when there are multiple loading indicators associated to a single context.
   *
   * @param source$ source observable to use for tracking loading
   * @param context any object to use for loading
   * @param loaderId optional, used if there are multiple loaders using same context
   * @param delay ms to delay before starting to load
   * @returns observable with result of source
   * @example loadingService.doLoading(desiredObservable, context, id).subscribe()
   */
  doLoading<V>(
    source$: Observable<V>,
    context?: LoadingContext,
    loaderId?: LoaderId,
    delay?: number
  ): Observable<V> {
    context = context || DEFAULT_CONTEXT;

    return source$.pipe(
      executeDelayed(() => {
        this.startLoading(context, loaderId);
      }, delay ?? 0),
      observeOn(asyncScheduler),
      finalize(() => {
        this.endLoading(context, loaderId);
      })
    );
  }

  /**
   * Use in html templates, returns a boolean indicating if a given loader is active in
   * a given context
   *
   * @param context loading context to check
   * @param loaderId If loaderId is unspecified, the method will return a logical disjunction of all
   *  loader states in the context.
   * @returns true if loader is stil loading
   */
  isLoading(context?: LoadingContext, loaderId?: LoaderId): boolean {
    context = context || DEFAULT_CONTEXT;
    const loaderStates = this.loadingStates.get(context);
    if (!loaderStates) {
      return false;
    } else {
      if (loaderId !== undefined) {
        return loaderStates.get(this.getLoaderId(loaderId)) ?? false;
      } else {
        return [...loaderStates.values()].filter((state) => state).length > 0;
      }
    }
  }

  /**
   * Use in html templates with async pipes
   *
   * @param context context to check
   * @param loaderId id of loader
   * @returns observable of booleans indicating if loader is active
   */
  isLoading$(
    context?: LoadingContext,
    loaderId?: LoaderId
  ): Observable<boolean> {
    context = context || DEFAULT_CONTEXT;
    const coalescedLoaderId = this.getLoaderId(loaderId);

    if (!this.hasLoadingStates(context, coalescedLoaderId)) {
      this.setLoadingState(context, false, loaderId);
    }

    return this.loadingStates$.get(context).get(coalescedLoaderId);
  }

  // The startLoading and endLoading methods are intended to be used when handling
  // complex scenarios where a need for extended usage flexibility is desired.

  /**
   * Start loading manually
   *
   * @param context context to start loading for
   * @param loaderId loader id to use
   */
  startLoading(context: LoadingContext, loaderId?: LoaderId): void {
    this.setLoadingState(context, true, this.getLoaderId(loaderId));
  }

  /**
   * End loading manually
   *
   * @param context context to end
   * @param loaderId loader id to end
   */
  endLoading(context: LoadingContext, loaderId?: LoaderId): void {
    this.setLoadingState(context, false, this.getLoaderId(loaderId));
  }

  /**
   * Clear all loadings
   * To be called by middleware code (HTTP interceptors/routing listeners, etc.).
   */
  clearLoadings(): void {
    this.loadingStates = new WeakMap<LoadingContext, Map<LoaderId, boolean>>();
    this.loadingStates$ = new WeakMap<
      LoadingContext,
      Map<LoaderId, BehaviorSubject<boolean>>
    >();
  }

  /**
   * Sets loading state for a context
   *
   * @param context loading context
   * @param state true if loading
   * @param loaderId loader id
   */
  protected setLoadingState(
    context: LoadingContext,
    state: boolean,
    loaderId: LoaderId
  ): void {
    if (!this.hasLoadingStates(context, loaderId)) {
      if (this.hasContextLoadingState(context)) {
        this.loadingStates.get(context).set(loaderId, state);
        this.loadingStates$
          .get(context)
          .set(loaderId, new BehaviorSubject<boolean>(state));
      } else {
        this.loadingStates.set(
          context,
          new Map<LoaderId, boolean>([[loaderId, state]])
        );
        this.loadingStates$.set(
          context,
          new Map<LoaderId, BehaviorSubject<boolean>>([
            [loaderId, new BehaviorSubject<boolean>(state)],
          ])
        );
      }
    } else {
      this.loadingStates.get(context).set(loaderId, state);
      this.loadingStates$.get(context).get(loaderId).next(state);
    }
  }

  /**
   * Checks context and loader id for loading states
   *
   * @param context context to check
   * @param loaderId loader id to check
   * @returns if there are states
   */
  protected hasLoadingStates(context: LoadingContext, loaderId: LoaderId): any {
    return (
      this.hasContextLoadingState(context) &&
      this.hasLoaderLoadingState(context, loaderId)
    );
  }

  /**
   * Checks if there is context loading state for context
   *
   * @param context loading context
   * @returns boolean
   */
  protected hasContextLoadingState(context: LoadingContext): any {
    return this.loadingStates.has(context) && this.loadingStates$.has(context);
  }

  /**
   * Checks if loader has loading state
   *
   * @param context loading context
   * @param loaderId loader id
   * @returns boolean probably
   */
  protected hasLoaderLoadingState(
    context: LoadingContext,
    loaderId: LoaderId
  ): any {
    return (
      this.loadingStates.get(context).has(loaderId) &&
      this.loadingStates$.get(context).has(loaderId)
    );
  }

  /**
   * Gets loader id or returns default
   *
   * @param loaderId loader if
   * @returns given loader id if exists or defaults
   */
  protected getLoaderId(loaderId?: LoaderId): LoaderId {
    return loaderId ?? DEFAULT_LOADER_ID;
  }
}
