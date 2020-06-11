import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { Channel } from '../models/channel';
import { Params } from '@angular/router';


export class MockChannelsService {

  channels = new BehaviorSubject<Channel[]>([]);

  testChannel = new Channel(
    1,
    'code',
    'name',
    -1,
    1,
    -1,
    1,
    'location',
    'staCode',
    'netCode'
  );

  getChannelsByFilters(filters: Params): Observable<Channel[]> {
    return of([this.testChannel]);
  }

  getChannel(id: number): Observable<Channel> {
    if ( id === this.testChannel.id) {
      return of(this.testChannel);
    } else {
      return throwError('not found');
    }
  }


}
