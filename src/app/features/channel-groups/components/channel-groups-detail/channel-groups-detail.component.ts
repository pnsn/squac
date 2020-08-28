import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-detail',
  templateUrl: './channel-groups-detail.component.html',
  styleUrls: ['./channel-groups-detail.component.scss']
})
export class ChannelGroupsDetailComponent implements OnInit, OnDestroy {
  channelGroup : ChannelGroup;
  channelGroupSub : Subscription;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.channelGroupSub = this.route.data.subscribe(
      data => {
        this.channelGroup = data.channelGroup;
      }
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.channelGroupSub.unsubscribe();
  }
}
