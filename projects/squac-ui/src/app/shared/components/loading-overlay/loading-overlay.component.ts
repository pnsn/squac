import { Component, Input } from "@angular/core";

/** Component for displaying loading overlay */
@Component({
  selector: "app-loading-overlay",
  templateUrl: "./loading-overlay.component.html",
  styleUrls: ["./loading-overlay.component.scss"],
})
export class LoadingOverlayComponent {
  @Input() class;
}
