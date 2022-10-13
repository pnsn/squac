import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { ChannelGroupService } from "./channel-group.service";

describe("ChannelGroupService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });
  });

  it("should be created", () => {
    const service: ChannelGroupService = TestBed.inject(ChannelGroupService);

    expect(service).toBeTruthy();
  });

  // it("should get channelGroups", (done: DoneFn) => {
  //   channelGroupService.getChannelGroups().subscribe((channelGroups) => {
  //     expect(channelGroups[0].id).toEqual(testChannelGroup.id);
  //     done();
  //   });
  // });

  // it("should get channelGroup with id", (done: DoneFn) => {
  //   channelGroupService.getChannelGroup(1).subscribe((channelGroup) => {
  //     expect(channelGroup.id).toEqual(testChannelGroup.id);
  //     done();
  //   });
  // });

  // it("should put channel group with id", (done: DoneFn) => {
  //   const testGroup = new ChannelGroup(1, 1, "name", "description", 1);
  //   channelGroupService.updateChannelGroup(testGroup).subscribe((response) => {
  //     expect(response).toBeDefined();
  //     done();
  //   });
  // });

  // it("should post channel group without id", (done: DoneFn) => {
  //   const newChannelGroup = new ChannelGroup(
  //     null,
  //     null,
  //     "name",
  //     "description",
  //     1
  //   );

  //   channelGroupService
  //     .updateChannelGroup(newChannelGroup)
  //     .subscribe((response) => {
  //       expect(response).toBeDefined();
  //       done();
  //     });
  // });

  // it("should delete dashboard", (done: DoneFn) => {
  //   channelGroupService.deleteChannelGroup(1).subscribe((response) => {
  //     expect(response).toBeTruthy();
  //     done();
  //   });
  // });
});
