import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Service for communication between widgets
 */
@Injectable({
  providedIn: "root",
})
export class WidgetConnectService {
  emphasizedChannel = new Subject<string>();
  deemphasizeChannel = new Subject<string>();
}
