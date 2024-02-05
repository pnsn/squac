import { Component, Input } from "@angular/core";

/** Component for displaying loading overlay */
@Component({
  selector: "app-loading-overlay",
  templateUrl: "./loading-overlay.component.html",
  styles: [
    "#loading-container { position: absolute; width: 100%; height: 100%; z-index: 100000; }",
  ],
  standalone: true,
})
export class LoadingOverlayComponent {
  @Input() class;
}
