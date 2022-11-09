/**
 * Data types available in SQUAC
 */
export enum ArchiveTypes {
  DAY = "day",
  // HOUR = "hour",
  WEEK = "week",
  MONTH = "month",
  RAW = "raw",
}

/**
 * Stat types available for archive types type
 */
export enum ArchiveStatTypes {
  MEAN = "mean",
  LATEST = "latest",
  NUM_SAMPS = "num_samps",
  MEDIAN = "median",
  MIN = "min",
  MAX = "max",
  MIN_ABS = "minabs",
  MAX_ABS = "maxabs",
  P95 = "p95",
  P90 = "p90",
  p10 = "p10",
  p05 = "p05",
  STDEV = "stdev",
}

interface ArchiveTypeOption {
  short: string;
  full: string;
  useStatTypes: boolean;
}
export const ARCHIVE_TYPE_OPTIONS: {
  [key in ArchiveTypes]: ArchiveTypeOption;
} = {
  [ArchiveTypes.DAY]: {
    short: "daily",
    full: "day archive",
    useStatTypes: true,
  },
  [ArchiveTypes.MONTH]: {
    short: "monthly",
    full: "month archive",
    useStatTypes: true,
  },
  [ArchiveTypes.WEEK]: {
    short: "weekly",
    full: "week archive",
    useStatTypes: true,
  },
  [ArchiveTypes.RAW]: {
    short: "raw",
    full: "raw data",
    useStatTypes: false,
  },
};
