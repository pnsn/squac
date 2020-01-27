import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-channel-groups-filter',
  templateUrl: './channel-groups-filter.component.html',
  styleUrls: ['./channel-groups-filter.component.scss']
})
export class ChannelGroupsFilterComponent implements OnInit {
  constructor() { }
  @Output() filtersChanged = new EventEmitter<any>();

  visible = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  filters = {
    network : [],
    channel: [],
    station: [],
    location: []
  };

  ngOnInit() {
  }


  addFilter(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    console.log(type);
    // Add our fruit
    if ((value || '').trim()) {
      this.filters[type].push(value.trim().toLowerCase());
      this.updateFilters();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeFilter(filter: string, groupKey: any): void {
    const index = this.filters[groupKey].indexOf(filter.toLowerCase());

    if (index >= 0) {
      this.filters[groupKey].splice(index, 1);
      this.updateFilters();
    }
  }

  updateFilters() {
    const searchFilters = {};
    for (const filterGroup in this.filters) {
      if (this.filters[filterGroup].length > 0) {
        let filterStr = '';
        searchFilters[filterGroup] = this.filters[filterGroup].toString();
        for (const filter of this.filters[filterGroup]) {
          if (filter.add) {
            filterStr += filter.value.toLowerCase();
          }
        }
      }

    }
    this.filtersChanged.next(searchFilters);
  }
}
