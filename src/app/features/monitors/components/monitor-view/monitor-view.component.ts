import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Monitor } from '@features/alarms/models/monitor';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-monitor-view',
  templateUrl: './monitor-view.component.html',
  styleUrls: ['./monitor-view.component.scss']
})
export class MonitorViewComponent implements OnInit {
  monitors: Monitor[];

  selected: Monitor[];

  selectedMonitorId: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  ngOnInit(): void {
    this.selected = [];
    this.monitors = this.route.parent.snapshot.data.monitors;
    if (this.route.firstChild) {
      this.selectedMonitorId = +this.route.firstChild.snapshot.params.monitorId;
      this.selectMonitor(this.selectedMonitorId);
    }
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.selected = [...this.selected];
  }

  addMonitor() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

    // Getting a selected channel group and setting variables
  selectMonitor(selectedMonitorId: number) {
    this.selected = this.monitors.filter( cg => { // Select row with channel group
      return (cg.id === selectedMonitorId);
    });
  }

  // onSelect function for data table selection
  onSelect($event) { // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate([selectedId], {relativeTo: this.route});
      this.selectedMonitorId = selectedId;
      this.selectMonitor(selectedId);
    }
  }

}
