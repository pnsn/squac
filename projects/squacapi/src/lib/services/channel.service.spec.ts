import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { ChannelService } from "./channel.service";

describe("ChannelService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });
  });

  it("should be created", () => {
    const service: ChannelService = TestBed.inject(ChannelService);

    expect(service).toBeTruthy();
  });

  // it("should get channels with filters", (done: DoneFn) => {
  //   const filter = { net: 1 };
  //   channelService.getChannelsByFilters(filter).subscribe((channels) => {
  //     expect(channels.length).toEqual(1);
  //     done();
  //   });
  // });
});
