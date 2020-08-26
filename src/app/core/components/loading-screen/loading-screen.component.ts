import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  loading: boolean;
  status: string;
  subscription: Subscription = new Subscription();
  constructor(
    private loadingService: LoadingService
    ) { }

  ngOnInit(): void {    
    const loadStatusSub = this.loadingService.loadingStatus.subscribe(
      text => {
        this.status = text;
      }
    )
    this.subscription.add(loadStatusSub);

    // .pipe(
    //   debounceTime(200)
    // )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
