import { HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageTypes } from "@core/services/local-storage.service";
import { LocalStorageService } from "@core/services/local-storage.service";

export const CachableRoutePatterns = {
  "dashboard/dashboards": true,
  "https://pokeapi.co/api/v2/pokemon": false,
};
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

  /**
   * Get an item from the cache
   * @param req
   */
  get(req: HttpRequest<any>): HttpResponse<any> {
    const cachedItem = this.shouldCacheToSessionStorage(req.urlWithParams)
      ? LocalStorageService.getItem(
          LocalStorageTypes.SESSION,
          req.urlWithParams
        )
      : this.cache[req.urlWithParams];
    if (cachedItem) {
      return cachedItem;
    }
  }

  /**
   * Put an item in the cache
   * @param req
   * @param res
   */
  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
    const shouldCache = this.shouldCache(req.url);
    const shouldCacheToSessionStorage = this.shouldCacheToSessionStorage(
      req.url
    );
    if (shouldCache && shouldCacheToSessionStorage) {
      this.cacheToSessionStorage(req.urlWithParams, res);
    } else if (shouldCache) {
      this.cacheToLocal(req.urlWithParams, res);
    }
  }

  /**
   * Delete an item from the cache
   * @param req
   */
  delete(req: HttpRequest<any>): boolean {
    //need to delete everything?
    const cachedRequest = this.get(req);
    const shouldCacheToSessionStorage = this.shouldCacheToSessionStorage(
      req.urlWithParams
    );
    let returnVal = false;
    if (shouldCacheToSessionStorage && cachedRequest) {
      LocalStorageService.removeItem(
        LocalStorageTypes.SESSION,
        req.urlWithParams
      );
      returnVal = true;
    } else if (cachedRequest) {
      delete this.cache[req.urlWithParams];
      returnVal = true;
    }
    return returnVal;
  }

  /**
   * Determine if a url SHOULD be cached or not. It must match a route pattern provided in
   * @link(CachableRoutePatterns)
   *
   * @param urlWithParams
   */
  shouldCache(url: string) {
    console.log(url);
    let shouldCache = false;
    Object.keys(this.cachableRoutes).forEach((pattern) => {
      const routeMatch = url.includes(pattern);
      if (routeMatch) {
        shouldCache = true;
      }
    });
    return shouldCache;
  }

  /**
   * Determine if a url SHOUlD be placed in sessionStorage or not. It must match a route pattern provided in
   * @link(CachableRoutePatterns) AND the item in CachableRoutePatterns must have a value of `true`
   *
   * @param urlWithParams
   */
  shouldCacheToSessionStorage(url: string) {
    console.log(url);
    let shouldCache = false;
    Object.keys(this.cachableRoutes).forEach((pattern) => {
      const routeMatch = url.includes(pattern);
      if (routeMatch && this.cachableRoutes[pattern] === true) {
        shouldCache = true;
      }
    });
    return shouldCache;
  }

  /**
   * Place the response in the local `cache` variable
   *
   * @param urlWithParams
   * @param res
   */
  cacheToLocal(urlWithParams: string, res: HttpResponse<any>) {
    console.log("cache to local", urlWithParams);
    this.cache[urlWithParams] = res;
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
// import { Injectable } from "@angular/core";

// const DEFAULT_MAX_AGE = 60; /** Max age of stored data */
// /**
//  * Service for storing data on front end
//  */
// @Injectable()
// export class CacheService {
//   data = new Map<string, any>();
//   expirations = new Map<string, number>();

//   hasData(key): boolean {
//     const now = new Date().getTime();
//     if (this.expirations.has(key) && this.expirations.get(key) > now) {
//       return true; //less than 5 minutes old
//     }
//     //expired data so remove
//     this.removeData(key);
//     return false;
//   }

//   setData(key: any, data: any, maxAgeInSeconds?: number): void {
//     this.data.set(key, data);

//     // 5 minutes from now
//     const now = new Date().getTime();
//     const expirationTime = maxAgeInSeconds
//       ? maxAgeInSeconds * 1000 + now
//       : DEFAULT_MAX_AGE * 1000 + now;
//     this.expirations.set(key, expirationTime);
//   }

//   getData(key: any): any {
//     console.log("get data", key, this.data.get(key));
//     return this.data.get(key);
//   }

//   removeData(key: any): void {
//     this.data.delete(key);
//     this.expirations.delete(key);
//   }
// }
