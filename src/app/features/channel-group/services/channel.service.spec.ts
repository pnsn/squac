import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { ChannelService } from "./channel.service";

describe("ChannelService", () => {
  let channelService: ChannelService;

  const testChannel = {
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
    user: 1,
    starttime: "",
    endtime: "",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });

    channelService = TestBed.inject(ChannelService);
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
