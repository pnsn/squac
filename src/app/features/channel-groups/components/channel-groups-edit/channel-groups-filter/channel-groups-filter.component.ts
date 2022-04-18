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
    const value = event.target.value.toLowerCase();
    if (value) {
      this.filters[type] = value.trim();
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
