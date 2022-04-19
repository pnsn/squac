import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LoadingService } from "@core/services/loading.service";
import { finalize } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  activeRequests = 0;

  /**
   * URLs for which the loading screen should not be enabled
   */
  skipUrls = ["measurement", "channels", "monitors"];

  constructor(private loadingService: LoadingService) {}

  // got this from the internet, not sure I like it
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;

    for (const url of this.skipUrls) {
      if (new RegExp(url).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    if (request.method !== "GET") {
      displayLoadingScreen = false;
    }

    if (displayLoadingScreen) {
      if (this.activeRequests === 0) {
        this.loadingService.startLoading();
      }
      this.activeRequests++;

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.loadingService.stopLoading();
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
