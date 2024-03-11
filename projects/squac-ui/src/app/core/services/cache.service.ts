import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageTypes } from "@core/services/local-storage.service";
import { LocalStorageService } from "@core/services/local-storage.service";
import { CACHEABLE_ROUTE_PATTERNS } from "../constants/cacheable-route-patterns.constant";
import * as Route from "route-parser";
import { MatchingRoute } from "./interfaces";

/**
 * Http cache requests
 */
abstract class HttpCache {
  /** Get request */
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  /** put request */
  abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
  /** delete request */
  abstract delete(req: HttpRequest<any>): boolean;
}

/**
 * Service to manage request caching
 */
@Injectable({
  providedIn: "root",
})
export class HttpCacheService implements HttpCache {
  cache: Record<string, HttpResponse<any>> = {};
  cachableRoutes = CACHEABLE_ROUTE_PATTERNS;

  /**
   * Removes everything before api in request
   *
   * @param url url to strip
   * @returns altered string
   */
  stripUrl(url: string): string {
    return url.replace(/.*\/api/, "");
  }

  /**
   * Get an item from the cache
   *
   * @param req http request to search for
   * @returns cached request if found
   */
  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const urlWithParams = this.stripUrl(req.urlWithParams);
    const storageLocation = this.whichStorageToUse(urlWithParams);
    const cachedItem = storageLocation
      ? LocalStorageService.getItem(storageLocation, urlWithParams)
      : this.cache[urlWithParams];
    if (cachedItem) {
      return new HttpResponse(cachedItem);
    }
    return null;
  }

  /**
   * Put an item in the cache
   *
   * @param req request
   * @param res response
   */
  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const urlWithParams = this.stripUrl(req.urlWithParams);

    const shouldCache = this.shouldCache(urlWithParams);
    const storageLocation = this.whichStorageToUse(urlWithParams);

    if (shouldCache && storageLocation) {
      this.cacheToStorage(storageLocation, urlWithParams, res);
    } else if (shouldCache) {
      this.cacheToLocal(urlWithParams, res);
    }
  }

  /**
   * Delete an item from the cache
   *
   * @param req request
   * @returns true if successfullty removed
   */
  delete(req: HttpRequest<any>): boolean {
    const urlWithParams = this.stripUrl(req.urlWithParams);
    //need to delete everything?, expiration
    const cachedRequest = this.get(req);
    const storageLocation = this.whichStorageToUse(urlWithParams);

    let returnVal = false;
    if (storageLocation && cachedRequest) {
      const matchingRoute = this.matchRoutes(urlWithParams);
      LocalStorageService.invalidateCache(matchingRoute);
      returnVal = true;
    } else if (cachedRequest) {
      delete this.cache[urlWithParams];
      returnVal = true;
    }
    return returnVal;
  }

  /**
   * Finds matching route for url
   *
   * @param urlWithParams url to match
   * @returns matching route if found
   */
  matchRoutes(urlWithParams: string): MatchingRoute {
    let matchingRoute: any;
    let pattern = "";
    Object.keys(this.cachableRoutes).forEach((cacheRoute) => {
      const route = new Route(cacheRoute);
      const routeMatch = route.match(urlWithParams);

      if (routeMatch) {
        matchingRoute = routeMatch;
        pattern = cacheRoute;
      }
    });
    return { route: matchingRoute, pattern: pattern };
  }

  /**
   * Determine if a url SHOULD be cached or not.
   * It must match a route pattern provided in
   *
   * @param urlWithParams url to check
   * @returns true if route should be cached
   */
  shouldCache(urlWithParams: string): boolean {
    return !!this.matchRoutes(urlWithParams).route;
  }

  /**
   * Determine if a url SHOUlD be placed in sessionStorage or not.
   * It must match a route pattern provided in
   *
   * @param urlWithParams url to check
   * @returns true if route should be cached to session storage
   */
  shouldCacheToSessionStorage(urlWithParams: string): boolean {
    const matchRoutes = this.matchRoutes(urlWithParams);
    return (
      !!matchRoutes.route && this.cachableRoutes[matchRoutes.pattern] === true
    );
  }

  /**
   * Determine if a url should be place in local or sessions storage and which one
   * It must match a route pattern provided in CACHEABLE_ROUTE_PATTERNS
   *
   * @param urlWithParams url to cache
   * @returns which storage to use
   */
  whichStorageToUse(urlWithParams: string): LocalStorageTypes {
    const matchRoutes = this.matchRoutes(urlWithParams);
    return matchRoutes ? this.cachableRoutes[matchRoutes.pattern] : undefined;
  }

  /**
   * Place the response in the local `cache` variable
   *
   * @param urlWithParams url to cache
   * @param res response
   */
  cacheToLocal(urlWithParams: string, res: HttpResponse<any>): void {
    this.cache[urlWithParams] = res;
  }

  /**
   * Place the response in localStorage
   *
   * @param storageType storage type
   * @param urlWithParams url to cache
   * @param res http response
   */
  cacheToStorage(
    storageType: LocalStorageTypes,
    urlWithParams: string,
    res: HttpResponse<any>
  ): void {
    try {
      LocalStorageService.setItem(storageType, urlWithParams, res);
    } catch (e) {
      this.cacheToLocal(urlWithParams, res);
    }
  }
}
