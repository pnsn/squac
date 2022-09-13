import { Injectable, NgZone } from "@angular/core";
import { asyncScheduler, BehaviorSubject, Observable } from "rxjs";
import { finalize, observeOn } from "rxjs/operators";

type LoadingContext = object;
type LoaderId = string | number; // expected enum values
const DEFAULT_LOADER_ID: LoaderId = "_DEFAULT";
const DEFAULT_CONTEXT: LoadingContext = { _DEFAULT: true };
/**
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

  // Observable creation operator.
  // LoaderId can be used when there are multiple loading indicators associated to a single context.
  // Context can be any object, though in practice, components and services will be the most common contexts.
  // loaderId is a non-mandatory parameter - when not specified, a default loaderId is used.
  // Such a scenario is used when your context has contains only one loading indicator.
  doLoading<V>(
    source$: Observable<V>,
    context?: LoadingContext,
    loaderId?: LoaderId
  ): Observable<V> {
    context = context || DEFAULT_CONTEXT;
    this.startLoading(context, loaderId);
    return source$.pipe(
      observeOn(asyncScheduler)
      // finalize(() => this.endLoading(context, loaderId))
    );
  }

  // To be used in your html templates.
  // Returns a boolean indicating whether a given loader is active in a given context.
  // If loaderId is unspecified, the method will return a logical disjunction of all
  // loader states in the context.
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

  // To be used in your html templates with async pipes.
  // Returns an Observable of booleans indicating whether a given loader is active in a given context.
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
  startLoading(context: LoadingContext, loaderId?: LoaderId): void {
    console.log("start loading", context);
    this.setLoadingState(context, true, this.getLoaderId(loaderId));
  }

  endLoading(context: LoadingContext, loaderId?: LoaderId): void {
    console.log("end loading");
    this.setLoadingState(context, false, this.getLoaderId(loaderId));
  }

  // To be called by middleware code (HTTP interceptors/routing listeners, etc.).
  clearLoadings(): void {
    this.loadingStates = new WeakMap<LoadingContext, Map<LoaderId, boolean>>();
    this.loadingStates$ = new WeakMap<
      LoadingContext,
      Map<LoaderId, BehaviorSubject<boolean>>
    >();
  }

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

  protected hasLoadingStates(context: LoadingContext, loaderId: LoaderId) {
    return (
      this.hasContextLoadingState(context) &&
      this.hasLoaderLoadingState(context, loaderId)
    );
  }

  protected hasContextLoadingState(context: LoadingContext) {
    return this.loadingStates.has(context) && this.loadingStates$.has(context);
  }

  protected hasLoaderLoadingState(context: LoadingContext, loaderId: LoaderId) {
    return (
      this.loadingStates.get(context).has(loaderId) &&
      this.loadingStates$.get(context).has(loaderId)
    );
  }

  protected getLoaderId(loaderId?: LoaderId): LoaderId {
    return loaderId ?? DEFAULT_LOADER_ID;
  }
}
