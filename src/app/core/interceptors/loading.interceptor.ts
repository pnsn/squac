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
  /**
   * URLs for which the loading screen should not be enabled
   */
  skipUrls = ["measurement", /groups\/\d+/];

  constructor(private loadingService: LoadingService) {}

  // got this from the internet, not sure I like it
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;

    // If url contains a skipUrl, don't show
    for (const url of this.skipUrls) {
      if (new RegExp(url).test(request.url)) {
        displayLoadingScreen = false;
        break;
      }
    }

    // Only load for GET requests
    if (request.method !== "GET") {
      displayLoadingScreen = false;
    }

    if (displayLoadingScreen) {
      // this.loadingService.requestStarted(request.url);
      // keep showing loading screen until there are no requests left
      return next.handle(request).pipe(
        finalize(() => {
          this.loadingService.requestFinished(request.url);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
