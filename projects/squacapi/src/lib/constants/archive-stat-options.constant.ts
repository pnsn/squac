import { ArchiveStatType } from "../types";

/** Default archive type labels */
export const ARCHIVE_STAT_OPTIONS: {
  [key in ArchiveStatType]: string;
} = {
  mean: "mean",
  num_samps: "# samples",
  median: "median",
  min: "min",
  max: "max",
  minabs: "min abs",
  maxabs: "max abs",
  p95: "95%-ile",
  p90: "90%-ile",
  p10: "10%-ile",
  p05: "05%-ile",
  stdev: "stdev",
};
