import { Injectable } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { BehaviorSubject } from 'rxjs';

interface StatTypeHttpData {
  id: number;
  type: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatTypeService {
  private url = 'dashboard/stattype/';

  statTypes = new BehaviorSubject<StatTypeHttpData[]>([]);
  constructor(
    private squacApi: SquacApiService
  ) {
  }

  // only get, no update
  fetchStatTypes() {
    this.squacApi.get(this.url)
      .subscribe(
        result => {
          this.statTypes.next(result);
        },
        error => {
          console.log('error in stattype service: ' + error);
        }
      );
  }
}
