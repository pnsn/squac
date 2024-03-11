import { Channel } from "squacapi";

/**
 * Sort function for channels/station rows
 *
 * @param propA first value
 * @param propB second value
 * @returns difference
 */
export const NslcComparator = (propA: string, propB: string): number => {
  return propA.localeCompare(propB);
};

/**
 * Sort function for channels
 *
 * @param channelA first channel
 * @param channelB second channel
 * @returns difference
 */
export const ChannelComparator = (
  channelA: Channel,
  channelB: Channel
): number => {
  return channelA.nslc.localeCompare(channelB.nslc);
};
