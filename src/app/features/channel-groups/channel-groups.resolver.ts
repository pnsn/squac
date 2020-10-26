import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChannelGroupsService } from './services/channel-groups.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsResolver implements Resolve<Observable<any>> {
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private loadingService: LoadingService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('id');
    if (id) {
      this.loadingService.setStatus('Loading channel group');
      return this.channelGroupsService.getChannelGroup(id).pipe(
        catchError(this.handleError)
      );
    } else {
      this.loadingService.setStatus('Loading channel groups');
      return this.channelGroupsService.getChannelGroups().pipe(
        catchError(this.handleError)
      );
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
