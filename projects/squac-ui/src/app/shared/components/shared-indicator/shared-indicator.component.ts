import { NgIf, TitleCasePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { TooltipDirective } from "@shared/directives/tooltip.directive";

/**
 * Indicates sharing level
 */
@Component({
  selector: "shared-sharing-indicator",
  templateUrl: "./shared-indicator.component.html",
  standalone: true,
  imports: [TooltipDirective, MatIconModule, NgIf, TitleCasePipe],
})
export class SharedIndicatorComponent {
  /** true if shared with organization */
  @Input() shareOrg: boolean;
  /** true if shared with all */
  @Input() shareAll: boolean;
  /** type of resource */
  @Input() resource: string;
}
