import { Component, EventEmitter, Output } from "@angular/core";
import { SearchFilter } from "../interfaces";

/**
 * Search boxes for channel group editing
 */
@Component({
  selector: "channel-group-filter",
  templateUrl: "./channel-group-filter.component.html",
  styleUrls: ["./channel-group-filter.component.scss"],
})
export class ChannelGroupFilterComponent {
  @Output() filtersChanged = new EventEmitter<SearchFilter>();
  @Output() addFilterToRegex = new EventEmitter<SearchFilter>();
  // regex strings for each param
  filters: SearchFilter = {
    netSearch: "",
    chanSearch: "",
    staSearch: "",
    locSearch: "",
  };

  // strings for form
  net: string;
  chan: string;
  sta: string;
  loc: string;

  /**
   * Add formatting to match squacapi
   *
   * @param value filter value
   * @returns formatted filter
   */
  formatFilter(value: string): string {
    let filter;
    if (value) {
      const filterStr = value.toLowerCase().trim().replace(/\?/g, "."); //turn back to allowed character
      filter = `${filterStr}`;
    } else {
      filter = "";
    }
    return filter;
  }

  /**
   * Remove all filters
   */
  removeFilters(): void {
    this.net = "";
    this.chan = "";
    this.sta = "";
    this.loc = "";
    this.updateFilters();
  }

  /**
   * Emit filters
   */
  addToRegex(): void {
    this.populateFilters();
    this.addFilterToRegex.next(this.filters);
  }

  // send filters to parent on submit
  /**
   * Send filters to parent on submit
   */
  updateFilters(): void {
    this.populateFilters();
    this.filtersChanged.next(this.filters);
  }

  /**
   * Populate filter object
   */
  populateFilters(): void {
    if (!this.net && !this.chan && !this.sta && !this.loc) {
      this.filters = {};
    } else {
      this.filters = {
        netSearch: this.formatFilter(this.net),
        chanSearch: this.formatFilter(this.chan),
        staSearch: this.formatFilter(this.sta),
        locSearch: this.formatFilter(this.loc),
      };
    }
  }
}
