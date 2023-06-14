import { Component, Input } from "@angular/core";

/**
 * Component for displaying alarm status
 */
@Component({
  selector: "monitor-alarm-status",
  templateUrl: "./monitor-alarm-status.component.html",
  providers: [],
})
export class MonitorAlarmStatusComponent {
  @Input() inAlarm: boolean | undefined;
}
