import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: Subject<boolean> = new Subject();
  loadingStatus: Subject<string> = new Subject();

  activeRequests: number = 0;
  constructor() { }


  setStatus(text : string) {
    this.loadingStatus.next(text);
  }

  getInitialSquacData() {
    //get User
    //get Organizations
    //get Dashboards
    //get ChannelGroups
    //get Stattypes
    //get Metrics
  }





  startLoading() {
    this.loading.next(true);
    this.loadingStatus.next("Text here")
  }

  stopLoading() {
    this.loading.next(false);
    this.loadingStatus.next(null);
  }

}
