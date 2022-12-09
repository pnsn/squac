import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
export const PROJECT_NAME = "SQUAC";
import * as Route from "route-parser";
import { MatchingRoute } from "./interfaces";

/**
 * the types of local storage
 */
export enum LocalStorageTypes {
  LOCAL = "local",
  SESSION = "session",
}

/**
 * Service for interacting with local storage
 */
@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  /**
   * Get the storage facility
   *
   * @param storageType type of storage to use
   * @returns storage
   */
  private static _getStorage(storageType: LocalStorageTypes): Storage {
    return storageType === LocalStorageTypes.LOCAL
      ? localStorage
      : sessionStorage;
  }

  /**
   * Get a localStorage or sessionStorage item value
   *
   * @param storageType storage to look in
   * @param key url to lookup
   * @returns cached http response
   */
  static getItem(
    storageType: LocalStorageTypes,
    key: string
  ): HttpResponse<any> | any {
    const storage = LocalStorageService._getStorage(storageType);
    const val = storage.getItem(`${PROJECT_NAME}:${key}`);
    try {
      const res = JSON.parse(val);
      if (res instanceof HttpResponse) {
        return new HttpResponse(res);
      } else {
        return res;
      }

      // return JSON.parse(val);
    } catch (e) {
      //something wrong with response
      return val;
    }
  }

  /**
   * Set a localStorage or sessionStorage item value
   *
   * @param storageType storage to store in
   * @param key key to save in
   * @param value request to save
   * @returns true if set
   */
  static setItem(
    storageType: LocalStorageTypes,
    key: string,
    value: any
  ): void {
    const storage = LocalStorageService._getStorage(storageType);
    const val = typeof value === "string" ? value : JSON.stringify(value);
    return storage.setItem(`${PROJECT_NAME}:${key}`, val);
  }

  /**
   * Remove an item from localStorage or sessionStorage
   *
   * @param storageType storage type to use
   * @param key key to remove
   */
  static removeItem(storageType: LocalStorageTypes, key: string): void {
    const storage = LocalStorageService._getStorage(storageType);
    storage.removeItem(`${PROJECT_NAME}:${key}`);
  }

  /**
   * Remove any items with matching pattern from localStorage or sessionStorage
   *
   * @param storageType storage type to use
   * @param matchingRoute route to search for
   * @returns array of keys removed
   */
  static removeMatchingItems(
    storageType: LocalStorageTypes,
    matchingRoute: MatchingRoute
  ): any[] {
    const storage = LocalStorageService._getStorage(storageType);
    let i;
    const results = [];

    //if route with :id has changed, remove routes that may contain that item
    let parentRoutePattern;
    if (matchingRoute.route && matchingRoute.route.id) {
      parentRoutePattern = matchingRoute.pattern.replace(":id/", "");
    }

    for (i in storage) {
      if (i in storage) {
        const key = i.replace(`${PROJECT_NAME}:`, "");

        const route = new Route(matchingRoute.pattern);
        const routeMatch = route.match(key);

        let parentRouteMatch;
        if (parentRoutePattern) {
          const parentRoute = new Route(parentRoutePattern);
          parentRouteMatch = parentRoute.match(key);
        }

        if (routeMatch || parentRouteMatch) {
          storage.removeItem(i);
          results.push(key);
        }
      }
    }
    return results;
  }

  /**
   * Empty all cache items that match route
   * Empty all cache items if no route
   *
   * @param matchingRoute route to match against
   */
  static invalidateCache(matchingRoute?: MatchingRoute): void {
    const results = [];
    const prefix = PROJECT_NAME;
    Object.values(LocalStorageService).forEach((storageType) => {
      const storage = LocalStorageService._getStorage(storageType);
      let i;
      let route;
      let parentRoutePattern;
      if (matchingRoute) {
        route = new Route(matchingRoute.pattern);
        if (matchingRoute.route && matchingRoute.route.id) {
          parentRoutePattern = matchingRoute.pattern.replace(":id/", "");
        }
      }

      for (i in storage) {
        if (i in storage) {
          if (!matchingRoute && i.match(prefix)) {
            storage.removeItem(i);
            results.push(i);
          }
          if (matchingRoute && route) {
            const key = i.replace(`${PROJECT_NAME}:`, "");

            const routeMatch = route.match(key);

            let parentRouteMatch;
            if (parentRoutePattern) {
              const parentRoute = new Route(parentRoutePattern);
              parentRouteMatch = parentRoute.match(key);
            }

            if (routeMatch || parentRouteMatch) {
              storage.removeItem(i);
              results.push(key);
            }
          }
        }
      }
    });
  }
}
