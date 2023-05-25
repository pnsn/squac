/** ids for shared toggle */
export interface SharedToggleFilter {
  /** user id */
  user?: number;
  /** organization id */
  organization?: number;
}

/** text to use for filter taps */
export interface FilterText {
  /** display text for user option */
  user?: string;
  /** display text for organization option */
  org?: string;
  /** display text for all option */
  all?: string;
}
