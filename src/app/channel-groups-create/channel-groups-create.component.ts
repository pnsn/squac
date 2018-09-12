import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';
import { Subscription } from "rxjs";
@Component({
  selector: 'app-channel-groups-create',
  templateUrl: './channel-groups-create.component.html',
  styleUrls: ['./channel-groups-create.component.scss'],
  providers: [StationsService]
})
export class ChannelGroupsCreateComponent implements OnInit {
  subscription : Subscription = new Subscription(); // Handles connections
  constructor( 
    private stationsService: StationsService
  ) { }

  ngOnInit() {
    // Wait for query parameters to be populated
    const sub = this.stationsService.getStations().subscribe(
      stations => {
        console.log(stations)
      }
    );
    this.subscription.add(sub);
  }

}
