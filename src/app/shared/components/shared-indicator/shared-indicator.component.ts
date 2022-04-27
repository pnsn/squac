import { Component, Input } from "@angular/core";

@Component({
  selector: "shared-sharing-indicator",
  templateUrl: "./shared-indicator.component.html",
  styleUrls: ["./shared-indicator.component.scss"],
})
export class SharedIndicatorComponent {
  @Input() shareOrg: boolean;
  @Input() shareAll: boolean;
  @Input() resource: string;
}
