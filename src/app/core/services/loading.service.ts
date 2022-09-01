import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, delay, tap } from "rxjs";

// Handles loading status for loading screen
@Injectable({
  providedIn: "root",
})
export class LoadingService implements OnDestroy {
  loading: Subject<boolean> = new BehaviorSubject(false);
  loadingStatus: Subject<string> = new BehaviorSubject(null);
  activeCount = 0;

  requests = new Subject<any>();
  $requests = this.requests.asObservable();
  requestSub;

  constructor() {
    this.requestSub = this.$requests
      .pipe(
        tap(() => {
          this.loading.next(this.activeCount > 0);
          if (this.activeCount === 0) {
            this.loadingStatus.next(null);
          }
        })
      )
      .subscribe();
  }

  // changes the text shown on the loading screen
  setStatus(text: string): void {
    this.loadingStatus.next(text);
  }

  // Emits true to loading subscribers
  requestStarted(_url?): void {
    this.activeCount++;
    this.requests.next(true);
  }

  //    this.loadingStatus.next(null);
  // Emits false to loading subscribers
  // Removes message
  requestFinished(_url?): void {
    this.activeCount--;
    this.requests.next(false);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.requestSub.unsubscribe();
  }
}
