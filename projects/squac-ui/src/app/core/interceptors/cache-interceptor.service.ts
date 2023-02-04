import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpCacheService } from "../services/cache.service";
import { REFRESH_REQUEST } from "squacapi";
import { Observable, of, tap } from "rxjs";

/**
 * Intercept http requests and handle caching
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private _cache: HttpCacheService) {}

  /**
   * Intercepts all http requests and checks if they should be cached
   * will return the cached response or will return the request
   *
   * @param request - Http request
   * @param next - Http handler
   * @returns - Http event
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let cachedResponse: HttpResponse<any>;
    if (request.method === "GET") {
      cachedResponse = this._cache.get(request);
    } else if (
      request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH" ||
      request.method === "DELETE"
    ) {
      const _removedFromCache = this._cache.delete(request);
      return next.handle(request);
    }

    if (cachedResponse && !request.context.get(REFRESH_REQUEST) === true) {
      return of(cachedResponse.clone());
    }

    return next.handle(request).pipe(
      tap((httpEvent: HttpEvent<any>): void | HttpEvent<any> => {
        if (httpEvent instanceof HttpResponse) {
          this._cache.put(request, httpEvent);
          return httpEvent;
        }
      })
    );
  }
}
