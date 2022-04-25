import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-channel-groups-filter",
  templateUrl: "./channel-groups-filter.component.html",
  styleUrls: ["./channel-groups-filter.component.scss"],
})
export class ChannelGroupsFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  filters = {
    net_search: "",
    chan_search: "",
    sta_search: "",
    loc_search: "",
  };

  addFilter(event: any, type: string): void {
    const value: string = event.target.value.toLowerCase();
    if (value) {
      const filterStr = value.trim().replace(/\?/g, "."); //turn back to acceptable
      this.filters[type] = `^${filterStr}$`;
    } else {
      this.filters[type] = "";
    }
  }

  // send filters to parent on submit
  updateFilters() {
    console.log(this.filters);
    this.filtersChanged.next(this.filters);
  }
}
