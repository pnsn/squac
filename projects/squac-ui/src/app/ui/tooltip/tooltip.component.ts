import { Component } from "@angular/core";
import { TooltipPosition, TooltipTheme } from "./tooltip.enums";

/**
 * Tooltip component, attached to element using uiTooltip directive
 */
@Component({
  selector: "ui-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
})
export class TooltipComponent {
  /** Positioning of tooltip relative to the element */
  position: TooltipPosition = TooltipPosition.DEFAULT;
  /** Theme (dark or light) for tooltip coloring */
  theme: TooltipTheme = TooltipTheme.DEFAULT;
  /** Tooltip text */
  tooltip = "";
  /** left position relative to element */
  left = 0;
  /** right position relative to element */
  top = 0;
  /** tooltip visibility */
  visible = false;
}
