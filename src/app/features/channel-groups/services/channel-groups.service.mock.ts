import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ChannelGroup } from '@core/models/channel-group';

export class MockChannelGroupsService {
  testChannelGroup = new ChannelGroup(
    1,
    1,
    'name',
    'description',
    1,
    true,
    false,
    []
  );

  getChannelGroups(): Observable<ChannelGroup[]> {
    return of([this.testChannelGroup]);
  }

  getChannelGroup(id: number): Observable<ChannelGroup> {
    if ( id === this.testChannelGroup.id) {
      return of(this.testChannelGroup);
    } else {
      return throwError('not found');
    }
  }

  updateChannelGroup(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    return of(channelGroup);
  }

  deleteChannelGroup(id: number): Observable<ChannelGroup> {
    return of(this.testChannelGroup);
  }
}
