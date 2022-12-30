import { ArchiveTypeOption } from "../interfaces";
import { ArchiveType } from "../types";

/** Default archive type labels */
export const ARCHIVE_TYPE_OPTIONS: {
  [key in ArchiveType]: ArchiveTypeOption;
} = {
  ["day"]: {
    short: "daily",
    full: "day archive",
    useStatTypes: true,
  },
  ["month"]: {
    short: "monthly",
    full: "month archive",
    useStatTypes: true,
  },
  ["week"]: {
    short: "weekly",
    full: "week archive",
    useStatTypes: true,
  },
  ["raw"]: {
    short: "raw",
    full: "raw data",
    useStatTypes: false,
  },
};
