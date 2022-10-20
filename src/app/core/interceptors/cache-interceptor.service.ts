import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpCacheService } from "@core/services/cache.service";
import { LoadingService } from "@core/services/loading.service";
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  share,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";

/**
 * Intercept http requests and handle caching
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(
    private _loading: LoadingService,
    private _cache: HttpCacheService
  ) {}

  /**
   * intercept request
   * return cached data if available
   * stop loading on error
   * @param {HttpRequest} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(`REQUEST ${request.urlWithParams}`);
    let cachedResponse: HttpResponse<any>;
    if (request.method === "GET") {
      cachedResponse = this._cache.get(request);
      if (cachedResponse) {
        console.log(
          `Response from cache for ${request.urlWithParams}`,
          cachedResponse
        );
      }
    } else if (
      request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH" ||
      request.method === "DELETE"
    ) {
      const removedFromCache = this._cache.delete(request);
      if (removedFromCache) {
        console.log(`Cleared ${request.urlWithParams} from the cache`);
      }
      return next.handle(request);
    }
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    return next.handle(request).pipe(
      tap((httpEvent: HttpEvent<any>) => {
        console.log(httpEvent);
        if (httpEvent instanceof HttpResponse) {
          console.log(`REQUEST ${request.urlWithParams} save to cache`);
          this._cache.put(request, httpEvent);
          return httpEvent;
        }
      })
    );
  }
}
