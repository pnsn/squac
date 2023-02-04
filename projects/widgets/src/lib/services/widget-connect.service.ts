import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

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
  useDenseView = new Subject<boolean>();
}
