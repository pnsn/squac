import { Component, EventEmitter, Output } from "@angular/core";

// Search boxes for getting channels
@Component({
  selector: "channel-group-filter",
  templateUrl: "./channel-group-filter.component.html",
  styleUrls: ["./channel-group-filter.component.scss"],
})
export class ChannelGroupFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  // regex strings for each param
  filters: any = {
    net_search: "",
    chan_search: "",
    sta_search: "",
    loc_search: "",
  };

  // strings for form
  net: string;
  chan: string;
  sta: string;
  loc: string;

  // add formatting to match squacapi
  formatFilter(value: string): string {
    let filter;
    if (value) {
      const filterStr = value.toLowerCase().trim().replace(/\?/g, "."); //turn back to allowed character
      filter = `^${filterStr}`;
    } else {
      filter = "";
    }
    return filter;
  }

  // clear filters
  removeFilters(): void {
    this.net = "";
    this.chan = "";
    this.sta = "";
    this.loc = "";
    this.updateFilters();
  }

  // send filters to parent on submit
  updateFilters(): void {
    if (!this.net && !this.chan && !this.sta && !this.loc) {
      this.filters = {};
    } else {
      this.filters = {
        net_search: this.formatFilter(this.net),
        chan_search: this.formatFilter(this.chan),
        sta_search: this.formatFilter(this.sta),
        loc_search: this.formatFilter(this.loc),
      };
    }

    this.filtersChanged.next(this.filters);
  }
}
