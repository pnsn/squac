import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WidgetConnectService {
  emphasizedChannel = new Subject<string>();
  deemphasizeChannel = new Subject<string>();
  constructor() {}
}
