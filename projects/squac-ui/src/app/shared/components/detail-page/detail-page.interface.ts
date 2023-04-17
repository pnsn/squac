/**
 * Buttons to include in title area of page
 * Buttons set to true will be shown on page and emit events
 */
export interface TitleButtons {
  /** delete current resource */
  deleteButton?: boolean;
  /** add resource button */
  addButton?: boolean;
  /** edit current resource */
  editButton?: boolean;
  /** cancel or close current resource */
  cancelButton?: boolean;
  /** save button */
  saveButton?: boolean;
  /** true if text should be used to represent button instead of an icon */
  useText?: boolean;
}

/** Page configuration */
export interface PageOptions {
  /** buttons on page configuration */
  titleButtons?: TitleButtons;
  /** route path for navigation */
  path?: string;
}

/** Types of events from buttons */
export type ButtonEvent = "edit" | "add" | "delete" | "cancel" | "save";
