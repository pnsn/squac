import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-channel-groups-filtering',
  templateUrl: './channel-groups-filtering.component.html',
  styleUrls: ['./channel-groups-filtering.component.scss']
})
export class ChannelGroupsFilteringComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  visible = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];

  filters = {
    "network" : [],
    "channel": [],
    "station": [],
    "location": []
  }


  addFilter(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;
    console.log(type)
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

  updateFilters(){
    const searchFilters = {};

    for(let filterGroup in this.filters) {
      if(this.filters[filterGroup].length > 0) {
        let filterStr = "";
        searchFilters[filterGroup] = this.filters[filterGroup].toString();
        for(let filter of this.filters[filterGroup]) {
          if(filter.add) {
            filterStr += filter.value.toLowerCase();
          }
        }
      }

    }
    this.filtersChanged.next(searchFilters);
  }
}
