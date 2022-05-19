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
    const value: string = event.target.value.toLowerCase();
    if (value) {
      const filterStr = value.trim().replace(/\?/g, "."); //turn back to allowed character
      this.filters[type] = `^${filterStr}$`;
    } else {
      this.filters[type] = "";
    }
  }

  // send filters to parent on submit
  updateFilters() {
    this.filtersChanged.next(this.filters);
  }
}
