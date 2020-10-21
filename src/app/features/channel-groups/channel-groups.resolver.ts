import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChannelGroupsService } from './services/channel-groups.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsResolver implements Resolve<Observable<any>> {
  constructor(private channelGroupsService: ChannelGroupsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('id');
    if (id) {
      return this.channelGroupsService.getChannelGroup(id).pipe(
        catchError(this.handleError)
      );
    } else {
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
