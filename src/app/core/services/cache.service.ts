import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageTypes } from "@core/services/local-storage.service";
import { LocalStorageService } from "@core/services/local-storage.service";
import { CachableRoutePatterns } from "@squacapi/interfaces/api.interface";
import * as Route from "route-parser";

abstract class HttpCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  abstract put(req: HttpRequest<any>, res: HttpResponse<any>): void;
  abstract delete(req: HttpRequest<any>): boolean;
}

@Injectable({
  providedIn: "root",
})
export class HttpCacheService implements HttpCache {
  cache: { [key: string]: HttpResponse<any> } = {};
  cachableRoutes = CachableRoutePatterns;

  constructor() {
    console.log(
      `HttpCacheService constructed for ${Object.keys(this.cachableRoutes).join(
        ",\n"
      )}`
    );
  }

  stripUrl(url: string): string {
    return url.replace(/.*\/api/, "");
  }

  /**
   * Get an item from the cache
   * @param req
   */
  get(req: HttpRequest<any>): HttpResponse<any> {
    const urlWithParams = this.stripUrl(req.urlWithParams);
    const storageLocation = this.whichStorageToUse(urlWithParams);

    const cachedItem = storageLocation
      ? LocalStorageService.getItem(storageLocation, urlWithParams)
      : this.cache[urlWithParams];
    if (cachedItem && cachedItem instanceof HttpResponse) {
      return cachedItem;
    }
  }

  /**
   * Put an item in the cache
   * @param req
   * @param res
   */
  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const urlWithParams = this.stripUrl(req.urlWithParams);

    const shouldCache = this.shouldCache(urlWithParams);
    const storageLocation = this.whichStorageToUse(urlWithParams);
    if (shouldCache && storageLocation) {
      console.log("Cache to session storage");
      this.cacheToSessionStorage(urlWithParams, res);
    } else if (shouldCache) {
      console.log("cache to local storage");
      this.cacheToLocal(urlWithParams, res);
    }
  }

  /**
   * Delete an item from the cache
   * @param req
   */
  delete(req: HttpRequest<any>): boolean {
    const url = this.stripUrl(req.url);
    const urlWithParams = this.stripUrl(req.urlWithParams);
    //need to delete everything?, expiration
    const cachedRequest = this.get(req);
    const storageLocation = this.whichStorageToUse(urlWithParams);

    let returnVal = false;
    if (storageLocation && cachedRequest) {
      const matchingRoute = this.matchRoutes(urlWithParams);
      LocalStorageService.invalidateCache(matchingRoute);
      // console.log(results);
      returnVal = true;
    } else if (cachedRequest) {
      delete this.cache[urlWithParams];
      returnVal = true;
    }
    return returnVal;
  }

  matchRoutes(urlWithParams: string) {
    let matchingRoute;
    let pattern;
    Object.keys(this.cachableRoutes).forEach((cacheRoute) => {
      const route = new Route(cacheRoute);
      const routeMatch = route.match(urlWithParams);

      if (routeMatch) {
        matchingRoute = routeMatch;
        pattern = cacheRoute;
      }
    });
    return { route: matchingRoute, pattern };
  }

  /**
   * Determine if a url SHOULD be cached or not. It must match a route pattern provided in
   * @link(CachableRoutePatterns)
   *
   * @param urlWithParams
   */
  shouldCache(urlWithParams: string) {
    return !!this.matchRoutes(urlWithParams).route;
  }

  /**
   * Determine if a url SHOUlD be placed in sessionStorage or not. It must match a route pattern provided in
   * @link(CachableRoutePatterns) AND the item in CachableRoutePatterns must have a value of `true`
   *
   * @param urlWithParams
   */
  shouldCacheToSessionStorage(urlWithParams: string) {
    const matchRoutes = this.matchRoutes(urlWithParams);
    return (
      !!matchRoutes.route && this.cachableRoutes[matchRoutes.pattern] === true
    );
  }

  /**
   * Determine if a url should be place in local or sessions storage and which one
   * It must match a route pattern provided in CachableRoutePatterns
   * @param urlWithParams
   * @returns
   */
  whichStorageToUse(urlWithParams: string): LocalStorageTypes {
    const matchRoutes = this.matchRoutes(urlWithParams);
    return matchRoutes ? this.cachableRoutes[matchRoutes.pattern] : undefined;
  }

  /**
   * Place the response in the local `cache` variable
   *
   * @param urlWithParams
   * @param res
   */
  cacheToLocal(urlWithParams: string, res: HttpResponse<any>) {
    this.cache[urlWithParams] = res;
  }

  /**
   * Place the response in localStorage
   * @param urlWithParams
   * @param res
   */
  cacheToStorage(
    storageType: LocalStorageTypes,
    urlWithParams: string,
    res: HttpResponse<any>
  ) {
    console.log("cache to local storage", urlWithParams);
    LocalStorageService.setItem(storageType, urlWithParams, res);
  }

  /**
   * Place the response in sessionStorage
   * @param urlWithParams
   * @param res
   */
  cacheToSessionStorage(urlWithParams: string, res: HttpResponse<any>) {
    console.log("cache to local", urlWithParams);
    LocalStorageService.setItem(LocalStorageTypes.SESSION, urlWithParams, res);
  }
}
