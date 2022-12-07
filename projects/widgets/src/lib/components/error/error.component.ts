import { Component, Input } from "@angular/core";

/**
 *
 */
@Component({
  selector: "widget-error",
  template:
    '<div id="error-container" class="error column centered"><p>{{errorMsg}}</p><div>',
  styleUrls: ["./error.component.scss"],
})
export class ErrorComponent {
  @Input() errorMsg: string;
}
