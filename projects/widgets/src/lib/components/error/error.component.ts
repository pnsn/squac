import { Component, Input } from "@angular/core";

/**
 * Component for showing error messages
 */
@Component({
  selector: "widget-error",
  template:
    '<div id="error-container" class="error column centered"><p>{{errorMsg}}</p><div>',
  styleUrls: ["./error.component.scss"],
  standalone: true,
  imports: [],
})
export class ErrorComponent {
  /** Message to display */
  @Input() errorMsg: string;
}
