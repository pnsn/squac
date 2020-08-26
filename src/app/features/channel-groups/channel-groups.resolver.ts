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
    const id = parseInt(route.paramMap.get('id'), 10);
    if(id) {
      return this.channelGroupsService.getChannelGroup(id).pipe(
        tap(data=> {
          console.log("in resolver, channel group")
        }),
        catchError(this.handleError)
      );
    } else {
      return this.channelGroupsService.getChannelGroups().pipe(
        tap(data=> {
          console.log("in resolver, channelgroups")
        }),
        catchError(this.handleError)
      );
      //return all of them 
    }
  }
  
  handleError(error) : Observable<any>{
    //TODO: route to show error
    return of({ error: error });
  }

}