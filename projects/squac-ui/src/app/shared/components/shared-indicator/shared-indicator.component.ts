import { Component, Input } from "@angular/core";

/**
 * Indicates sharing level
 */
@Component({
  selector: "shared-sharing-indicator",
  templateUrl: "./shared-indicator.component.html",
  styleUrls: ["./shared-indicator.component.scss"],
})
export class SharedIndicatorComponent {
  /** true if shared with organization */
  @Input() shareOrg: boolean;
  /** true if shared with all */
  @Input() shareAll: boolean;
  /** type of resource */
  @Input() resource: string;
}
