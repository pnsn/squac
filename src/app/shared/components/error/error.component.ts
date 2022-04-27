import { Component, Input } from "@angular/core";

@Component({
  selector: "shared-error",
  template: '<div id="error-container">{{errorMsg}}<div>',
  styleUrls: ["./error.component.scss"],
})
export class ErrorComponent {
  @Input() errorMsg: string;
}
