import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alarm } from '@features/alarms/models/alarm';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-alarm-view',
  templateUrl: './alarm-view.component.html',
  styleUrls: ['./alarm-view.component.scss']
})
export class AlarmViewComponent implements OnInit {
  alarms: Alarm[];

  selected: Alarm[];

  selectedAlarmId: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  ngOnInit(): void {
    this.selected = [];
    this.alarms = this.route.parent.snapshot.data.alarms;
    if (this.route.firstChild) {
      this.selectedAlarmId = +this.route.firstChild.snapshot.params.alarmId;
      this.selectAlarm(this.selectedAlarmId);
    }
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.selected = [...this.selected];
  }

  addAlarm() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

    // Getting a selected channel group and setting variables
  selectAlarm(selectedAlarmId: number) {
    this.selected = this.alarms.filter( cg => { // Select row with channel group
      return (cg.id === selectedAlarmId);
    });
  }

  // onSelect function for data table selection
  onSelect($event) { // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate([selectedId], {relativeTo: this.route});
      this.selectedAlarmId = selectedId;
      this.selectAlarm(selectedId);
    }
  }

}
