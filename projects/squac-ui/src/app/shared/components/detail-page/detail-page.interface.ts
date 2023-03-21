export interface TitleButtons {
  //if true, will show buttons & emit clicks
  deleteButton?: boolean;
  addButton?: boolean;
  editButton?: boolean;
  cancelButton?: boolean;
  saveButton?: boolean;
  useText?: boolean;
}

export interface PageOptions {
  titleButtons?: TitleButtons;
  path?: string;
}

export type ButtonEvent = "edit" | "add" | "delete" | "cancel" | "save";
