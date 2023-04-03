import { Injectable } from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  ReplaySubject,
  share,
  Subject,
} from "rxjs";

/**
 * Service for communication between widgets,
 * all widgets subscribe to same instance
 */
@Injectable({
  providedIn: "root",
})
export class WidgetConnectService {
  /** channel to emphasize */
  emphasizedChannel = new Subject<string>();
  /** channel to deemphasize */
  deemphasizeChannel = new Subject<string>();
  /** hide zoom controls */
  useDenseView = new ReplaySubject<boolean>(1);
  /** toggle channel list */
  toggleChannelList = new ReplaySubject<boolean>(1);

  /** obserable of emphasized channel with debounce */
  emphasizedChannel$ = this.emphasizedChannel
    .asObservable()
    .pipe(distinctUntilChanged(), debounceTime(500), share());
}
