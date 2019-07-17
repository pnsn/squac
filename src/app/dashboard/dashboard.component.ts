import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { View } from '../shared/view';
import { ViewsService } from '../views.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  views: View[];
  subscription: Subscription = new Subscription();

  constructor(private viewsService: ViewsService) {

  }

  ngOnInit() {
    this.views = this.viewsService.getViews();
    console.log(this.views)
    this.subscription.add(this.viewsService.viewsChanged.subscribe(
      (views: View[]) => {
        this.views = views;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
