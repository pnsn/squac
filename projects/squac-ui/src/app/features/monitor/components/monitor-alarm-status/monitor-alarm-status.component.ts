import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Component for displaying alarm status
 */
@Component({
  selector: "monitor-alarm-status",
  templateUrl: "./monitor-alarm-status.component.html",
  providers: [],
  standalone: true,
  imports: [NgIf, MatIconModule],
})
export class MonitorAlarmStatusComponent {
  @Input() inAlarm: boolean | undefined;
}
