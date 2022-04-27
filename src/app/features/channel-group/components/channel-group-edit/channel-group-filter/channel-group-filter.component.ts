import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "channel-group-filter",
  templateUrl: "./channel-group-filter.component.html",
  styleUrls: ["./channel-group-filter.component.scss"],
})
export class ChannelGroupFilterComponent {
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
    this.filtersChanged.next(this.filters);
  }
}
