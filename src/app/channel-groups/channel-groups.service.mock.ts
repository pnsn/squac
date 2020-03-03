import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChannelGroup } from '../shared/channel-group';

export class MockChannelGroupsService {
  testChannelGroup = new ChannelGroup(
    1,
    "",
    "",
    []
  );

  getChannelGroups = new BehaviorSubject<ChannelGroup[]>([]);

  fetchChannelGroups() {
    this.getChannelGroups.next([this.testChannelGroup]);
  }

  getChannelGroup(id :number) : Observable<ChannelGroup> {
    return of(this.testChannelGroup);
  }

  updateChannelGroup(channelGroup: ChannelGroup) {
    return of(channelGroup);
  }
}