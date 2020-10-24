import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit , OnDestroy {
  loading: boolean;
  statuses: string[] = [];
  subscription: Subscription = new Subscription();
  constructor(
    private loadingService: LoadingService
    ) { }

  ngOnInit(): void {
    const loadingSub = this.loadingService.loading.subscribe(
      loading => {
        this.loading = loading;
      }
    );
    const loadStatusSub = this.loadingService.loadingStatus.subscribe(
      text => {
        if(text) {
          this.statuses.push(text);
          if(this.statuses.length > 1) {
            this.statuses.splice(0, 1);
          } 
        } else {
          this.statuses = [];
        }
      }
    );
    this.subscription.add(loadStatusSub);

    // .pipe(
    //   debounceTime(200)
    // )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
