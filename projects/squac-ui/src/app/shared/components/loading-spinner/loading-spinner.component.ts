import { Component } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

/**
 * Component for displaying loading spinner
 */
@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  standalone: true,
  imports: [MatProgressBarModule],
})
export class LoadingSpinnerComponent {}
