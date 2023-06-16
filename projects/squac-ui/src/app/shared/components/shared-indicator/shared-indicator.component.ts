import { NgIf, TitleCasePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TooltipModule } from "@ui/tooltip/tooltip.module";

/**
 * Indicates sharing level
 */
@Component({
  selector: "shared-sharing-indicator",
  templateUrl: "./shared-indicator.component.html",
  standalone: true,
  imports: [TooltipModule, MatIconModule, NgIf, TitleCasePipe],
})
export class SharedIndicatorComponent {
  /** true if shared with organization */
  @Input() shareOrg: boolean;
  /** true if shared with all */
  @Input() shareAll: boolean;
  /** type of resource */
  @Input() resource: string;
}
