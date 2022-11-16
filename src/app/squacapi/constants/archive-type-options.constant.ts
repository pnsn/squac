import { ArchiveType } from "../enums";
import { ArchiveTypeOption } from "../interfaces";

export const ARCHIVE_TYPE_OPTIONS: {
  [key in ArchiveType]: ArchiveTypeOption;
} = {
  [ArchiveType.DAY]: {
    short: "daily",
    full: "day archive",
    useStatTypes: true,
  },
  [ArchiveType.MONTH]: {
    short: "monthly",
    full: "month archive",
    useStatTypes: true,
  },
  [ArchiveType.WEEK]: {
    short: "weekly",
    full: "week archive",
    useStatTypes: true,
  },
  [ArchiveType.RAW]: {
    short: "raw",
    full: "raw data",
    useStatTypes: false,
  },
};
