import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-channel-groups-detail',
  templateUrl: './channel-groups-detail.component.html',
  styleUrls: ['./channel-groups-detail.component.scss']
})
export class ChannelGroupsDetailComponent implements OnInit {
  channelGroup : ChannelGroup;

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.channelGroup = this.route.snapshot.data.channelGroup;
    console.log(this.channelGroup);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }

}
