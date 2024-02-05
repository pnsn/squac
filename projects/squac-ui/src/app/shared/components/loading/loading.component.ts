import { Component, Input } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

/**
 * Component for displaying loading indicator
 */
@Component({
  selector: "shared-loading",
  templateUrl: "./loading.component.html",
  styles: ["#loading-container {height: 100%; width: 100%; padding: 10px;}"],
  standalone: true,
  imports: [MatProgressBarModule],
})
export class LoadingComponent {
  @Input() loadingMsg: string;
}
