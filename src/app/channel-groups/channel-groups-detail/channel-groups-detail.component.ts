import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ChannelGroupsService } from '../channel-groups.service';
import { ChannelGroup } from '../../shared/channel-group';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel-groups-detail',
  templateUrl: './channel-groups-detail.component.html',
  styleUrls: ['./channel-groups-detail.component.scss']
})
export class ChannelGroupsDetailComponent implements OnInit, OnDestroy {
  id: number;
  channelGroup: ChannelGroup;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelGroupsService: ChannelGroupsService
  ) { }

  ngOnInit() {

    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.channelGroupsService.getChannelGroup(this.id).subscribe(channelGroup => {
          this.channelGroup = channelGroup;
        });
      }
    );

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  editChannelGroup() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
