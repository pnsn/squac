import { HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
export const PROJECT_NAME = "SQUAC";
import * as Route from "route-parser";

/**
 * the types of local storage
 */
export enum LocalStorageTypes {
  LOCAL = "local",
  SESSION = "session",
}

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  /**
   * Get the storage facility
   * @param storageType {LocalStorageTypes}
   * @private
   * @returns {localStorage|sessionStorage}
   */
  private static _getStorage(storageType: LocalStorageTypes) {
    return storageType === LocalStorageTypes.LOCAL
      ? localStorage
      : sessionStorage;
  }

  /**
   * Get a localStorage or sessionStorage item value
   * @param storageType {'local'|'session'}
   * @param key {string}
   */
  static getItem(
    storageType: LocalStorageTypes,
    key: string
  ): HttpResponse<any> {
    const storage = LocalStorageService._getStorage(storageType);
    const val = storage.getItem(`${PROJECT_NAME}:${key}`);
    try {
      const res = JSON.parse(val);
      return new HttpResponse(res);
      // return JSON.parse(val);
    } catch (e) {
      //something wrong with response
      return null;
    }
  }

  /**
   * Set a localStorage or sessionStorage item value
   * @param storageType {LocalStorageTypes}
   * @param key {string}
   * @param value {any}
   */
  static setItem(storageType: LocalStorageTypes, key: string, value: any) {
    const storage = LocalStorageService._getStorage(storageType);
    const val = typeof value === "string" ? value : JSON.stringify(value);
    storage.setItem(`${PROJECT_NAME}:${key}`, val);
  }

  /**
   * Remove an item from localStorage or sessionStorage
   * @param storageType {LocalStorageTypes}
   * @param key {string}
   */
  static removeItem(storageType: LocalStorageTypes, key: string) {
    const storage = LocalStorageService._getStorage(storageType);
    storage.removeItem(`${PROJECT_NAME}:${key}`);
  }

  /**
   * Remove an items with matching pattern from localStorage or sessionStorage
   * @param storageType {LocalStorageTypes}
   * @param key {string}
   */
  static removeMatchingItems(
    storageType: LocalStorageTypes,
    matchingRoute: {
      route: any;
      pattern: string;
    }
  ) {
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
    console.log("remove keys", results);
    return results;
  }

  /**
   * Empty all cache items that match route
   * Empty all cache items if no route
   */
  static invalidateCache(matchingRoute?: { route: any; pattern: string }) {
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
    console.log(results);
  }
}
