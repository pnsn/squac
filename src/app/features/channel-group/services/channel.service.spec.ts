import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { ChannelService } from "./channel.service";
import { ApiGetChannel } from "@core/models/channel";

describe("ChannelService", () => {
  let channelService: ChannelService;

  const testChannel: ApiGetChannel = {
    id: 1,
    network: "1",
    class_name: "channel",
    code: "nnn",
    name: "channel",
    station_code: "sta",
    loc: "loc",
    lat: 1919,
    lon: 222,
    station_name: "",
    url: "",
    description: "",
    sample_rate: 1,
    elev: 1,
    azimuth: 1,
    dip: 1,
    created_at: "",
    updated_at: "",
    nslc: "",
    user_id: "1",
    starttime: "",
    endtime: "",
  };

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
