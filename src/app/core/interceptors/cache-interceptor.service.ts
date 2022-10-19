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
import { catchError, finalize, Observable, tap } from "rxjs";

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
    let cachedResponse;
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
    }
    return next.handle(request).pipe(
      tap<HttpEvent<any>>((httpEvent: HttpEvent<any>) => {
        if (httpEvent instanceof HttpResponse) {
          this._cache.put(request, httpEvent);
        }
        return cachedResponse ? cachedResponse : httpEvent;
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      }),
      finalize(() => {
        this._loading.clearLoadings();
      })
    );
  }
}
