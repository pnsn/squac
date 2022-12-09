import { Component, Input } from "@angular/core";

/**
 * Component for displaying loading indicator
 */
@Component({
  selector: "shared-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent {
  @Input() loadingMsg: string;
}
