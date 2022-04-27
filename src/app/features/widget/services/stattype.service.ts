import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

interface StatTypeHttpData {
  id: number;
  type: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: "root",
})
export class StatTypeService {
  private url = "dashboard/stattype/";
  localStatTypes: StatTypeHttpData[];
  constructor(private squacApi: SquacApiService) {}

  getStatTypes(): Observable<StatTypeHttpData[]> {
    if (this.localStatTypes) {
      return of(this.localStatTypes);
    }
    return this.squacApi.get(this.url).pipe(
      tap((response) => {
        this.localStatTypes = response;
      })
    );
  }
}
