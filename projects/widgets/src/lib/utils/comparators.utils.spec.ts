import { Channel } from "squacapi";
import { ChannelComparator, NslcComparator } from "./comparators.utils";

describe("Comparators Utils", () => {
  it("NSLC comparator should sort Nslcs", () => {
    const nslcs = ["UW.RCM.00.ZZZ", "UO.RCM.00.HHH", "BB.XXX.00.NNN"];
    const sortedNslcs = nslcs.slice().sort(NslcComparator);
    expect(sortedNslcs[0]).toBe(nslcs[2]);
  });

  it("CHannel comparator should sort channels by nslc", () => {
    const channels: Channel[] = [
      new Channel({ nslc: "UW.RCM.00.ZZZ" }),
      new Channel({ nslc: "UO.RCM.00.ZZZ" }),
      new Channel({ nslc: "BB.RCM.00.ZZZ" }),
    ];

    const sortedChannels = channels.slice().sort(ChannelComparator);
    expect(sortedChannels[0]).toBe(channels[2]);
  });
});
