import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-channel-groups-filter',
  templateUrl: './channel-groups-filter.component.html',
  styleUrls: ['./channel-groups-filter.component.scss']
})
export class ChannelGroupsFilterComponent implements OnInit {
  constructor() { }
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    network : '',
    channel: '',
    station: '',
    location: ''
  };

  ngOnInit() {
  }


  addFilter(event: any, type: string): void {
    const value = event.target.value.toLowerCase();
    if (value !== '') {
      const paramArr = value.split(',');
      this.filters[type] = paramArr.reduce( (acc: string, param: string) => {
        return `${acc},${param.trim()}`;
      });
      this.updateFilters();
    }
  }

  updateFilters() {
    this.filtersChanged.next(this.filters);
  }
}
