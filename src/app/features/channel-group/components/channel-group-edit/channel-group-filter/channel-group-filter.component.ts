import { Component, EventEmitter, Output } from "@angular/core";
@Component({
  selector: "channel-group-filter",
  templateUrl: "./channel-group-filter.component.html",
  styleUrls: ["./channel-group-filter.component.scss"],
})
export class ChannelGroupFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  filters: any = {
    net_search: "",
    chan_search: "",
    sta_search: "",
    loc_search: "",
  };

  net: string;
  chan: string;
  sta: string;
  loc: string;

  formatFilter(value: string): string {
    let filter;
    if (value) {
      const filterStr = value.toLowerCase().trim().replace(/\?/g, "."); //turn back to allowed character
      filter = `^${filterStr}$`;
    } else {
      filter = "";
    }
    return filter;
  }

  removeFilters() {
    this.filters = {};
    this.filtersChanged.next(this.filters);
  }

  // send filters to parent on submit
  updateFilters() {
    this.filters = {
      net_search: this.formatFilter(this.net),
      chan_search: this.formatFilter(this.chan),
      sta_search: this.formatFilter(this.sta),
      loc_search: this.formatFilter(this.loc),
    };
    if (!this.net && !this.chan && !this.sta && !this.loc) {
      this.filters = {};
    }
    this.filtersChanged.next(this.filters);
  }
}
