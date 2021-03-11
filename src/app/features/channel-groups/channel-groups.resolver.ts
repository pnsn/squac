import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ChannelGroup } from '@core/models/channel-group';
import { LoadingService } from '@core/services/loading.service';
import { MessageService } from '@core/services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChannelGroupsService } from './services/channel-groups.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsResolver implements Resolve<Observable<any>> {
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private loadingService: LoadingService,
    private messageService: MessageService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ChannelGroup> | Observable<ChannelGroup[]> {
    const id = +route.paramMap.get('channelGroupId');

    if (id) {
      this.loadingService.setStatus('Loading channel group');
      return this.channelGroupsService.getChannelGroup(id).pipe(
        catchError(error => {
          this.messageService.error('Could not load channel group.');
          return this.handleError(error);
        })
      );
    } else {
      this.loadingService.setStatus('Loading channel groups');
      return this.channelGroupsService.getChannelGroups().pipe(
        catchError(error => {
          this.messageService.error('Could not load channel groups.');
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
