import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { ChannelService } from "./channel.service";
import { Channel } from "@core/models/channel";

describe("ChannelService", () => {
  let channelService: ChannelService;

  const testChannel: Channel = new Channel(
    1,
    "code",
    "name",
    0,
    0,
    0,
    0,
    "loc",
    "stationCode",
    "networkCode",
    "",
    ""
  );
  const mockSquacApiService = new MockSquacApiService(testChannel);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SquacApiService,
          useValue: mockSquacApiService,
        },
      ],
    });

    channelService = TestBed.inject(ChannelService);
  });

  it("should be created", () => {
    const service: ChannelService = TestBed.inject(ChannelService);

    expect(service).toBeTruthy();
  });

  it("should get channels with filters", (done: DoneFn) => {
    const filter = { net: 1 };
    channelService.getChannelsByFilters(filter).subscribe((channels) => {
      expect(channels.length).toEqual(1);
      done();
    });
  });
});
