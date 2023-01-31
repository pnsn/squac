/**
 * Archive stat types
 */
export const ArchiveStatType = [
  "mean",
  "num_samps",
  "median",
  "min",
  "max",
  "minabs",
  "maxabs",
  "p95",
  "p90",
  "p10",
  "p05",
  "stdev",
] as const;

export type ArchiveStatType = typeof ArchiveStatType[number];
