import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class LoadingService {
  loading: Subject<boolean> = new BehaviorSubject(false);
  loadingStatus: Subject<string> = new BehaviorSubject(null);

  // changes the text shown on the loading screen
  setStatus(text: string): void {
    this.loadingStatus.next(text);
  }

  // Emits true to loading subscribers
  startLoading(): void {
    this.loading.next(true);
  }

  // Emits false to loading subscribers
  // Removes message
  stopLoading(): void {
    this.loading.next(false);
    this.loadingStatus.next(null);
  }
}
