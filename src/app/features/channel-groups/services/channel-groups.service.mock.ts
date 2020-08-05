import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ChannelGroup } from '@core/models/channel-group';

export class MockChannelGroupsService {
  testChannelGroup = new ChannelGroup(
    1,
    1,
    'name',
    'description',
    true,
    false,
    []
  );

  getChannelGroups = new BehaviorSubject<ChannelGroup[]>([]);

  fetchChannelGroups() {
    this.getChannelGroups.next([this.testChannelGroup]);
  }

  getChannelGroup(id: number): Observable<ChannelGroup> {
    if ( id === this.testChannelGroup.id) {
      return of(this.testChannelGroup);
    } else {
      return throwError('not found');
    }
  }

  updateChannelGroup(channelGroup: ChannelGroup) {
    return of(channelGroup);
  }
}
