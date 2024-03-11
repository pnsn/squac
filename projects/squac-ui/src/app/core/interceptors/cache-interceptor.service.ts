import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { HttpCacheService } from "../services/cache.service";
import { REFRESH_REQUEST } from "squacapi";
import { of, tap } from "rxjs";

export const CacheInterceptorFn: HttpInterceptorFn = (req, next) => {
  const _cache = inject(HttpCacheService);
  let cachedResponse: HttpResponse<any>;
  if (req.method === "GET") {
    cachedResponse = _cache.get(req);
  } else if (
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "PATCH" ||
    req.method === "DELETE"
  ) {
    const _removedFromCache = _cache.delete(req);
    return next(req);
  }

  if (cachedResponse && !req.context.get(REFRESH_REQUEST) === true) {
    return of(cachedResponse.clone());
  }
  return next(req).pipe(
    tap((httpEvent: HttpEvent<any>): void | HttpEvent<any> => {
      if (httpEvent instanceof HttpResponse) {
        _cache.put(req, httpEvent);
        return httpEvent;
      }
    })
  );
};
