import { Injectable } from '@angular/core';
import { Subject, forkJoin, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: Subject<boolean> = new BehaviorSubject(false);
  loadingStatus: Subject<string> = new BehaviorSubject(null);

  activeRequests: number = 0;
  constructor(
  ) { }


  setStatus(text : string) {
    this.loadingStatus.next(text);
  }

  getInitialData() {
    this.loadingStatus.next("Logging in and loading data...");
  }

  startLoading() {
    this.loading.next(true);

  }

  stopLoading() {
    this.loading.next(false);
    this.loadingStatus.next(null);
  }

}
