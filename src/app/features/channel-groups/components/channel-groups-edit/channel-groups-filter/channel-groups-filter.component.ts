import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-channel-groups-filter",
  templateUrl: "./channel-groups-filter.component.html",
  styleUrls: ["./channel-groups-filter.component.scss"],
})
export class ChannelGroupsFilterComponent {
  constructor() {}
  @Output() filtersChanged = new EventEmitter<any>();
  filters = {
    network: "",
    chan_search: "",
    station: "",
    location: "",
  };

  addFilter(event: any, type: string): void {
    const value = event.target.value.toLowerCase();
    if (value) {
      if (type === "chan_search") {
        this.filters[type] = value.trim();
      } else {
        const paramArr = value.split(",");
        this.filters[type] = paramArr.reduce((acc: string, param: string) => {
          return `${acc},${param.trim()}`;
        });
      }
    } else {
      this.filters[type] = "";
    }
  }

  updateFilters() {
    this.filtersChanged.next(this.filters);
  }
}
