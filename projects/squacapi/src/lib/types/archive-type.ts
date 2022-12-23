/**
 * Archive data types
 */
export const ArchiveType = ["day", "week", "month", "raw"] as const;

export type ArchiveType = typeof ArchiveType[number];
