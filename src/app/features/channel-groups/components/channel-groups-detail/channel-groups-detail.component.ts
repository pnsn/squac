import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, id, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-detail',
  templateUrl: './channel-groups-detail.component.html',
  styleUrls: ['./channel-groups-detail.component.scss']
})
export class ChannelGroupsDetailComponent implements OnInit, OnDestroy {
  channelGroup: ChannelGroup;
  channelGroupSub: Subscription;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  error: boolean;

    constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.channelGroupSub = this.route.data.subscribe(
      data => {
        if(data.channelGroup.error){
          this.error = true;
        } else {
          this.error = false;
          this.channelGroup = data.channelGroup;
        }
      }
    );
  }

  editChannelGroup() {

    console.log(this.channelGroup.id)
    this.router.navigate(['edit'], {relativeTo: this.route});
  }


  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.channelGroupSub.unsubscribe();
  }
}
