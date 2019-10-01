import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ChannelGroupsService } from '../channel-groups.service';
import { ChannelGroup } from '../../shared/channel-group';

@Component({
  selector: 'app-channel-groups-detail',
  templateUrl: './channel-groups-detail.component.html',
  styleUrls: ['./channel-groups-detail.component.scss']
})
export class ChannelGroupsDetailComponent implements OnInit {
  id: number;
  channelGroup: ChannelGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelGroupsService: ChannelGroupsService
  ) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.channelGroupsService.getChannelGroup(this.id).subscribe(channelGroup => {
          this.channelGroup = channelGroup;
          console.log(channelGroup.name);
        });
      }
    );
  }
  editChannelGroup() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
