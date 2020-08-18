import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: Subject<boolean> = new Subject();
  loadingStatus: Subject<string> = new Subject();
  constructor() { }

  startLoading() {
    this.loading.next(true);
    this.loadingStatus.next("Text here")
  }

  stopLoading() {
    this.loading.next(false);
    this.loadingStatus.next(null);
  }

}
