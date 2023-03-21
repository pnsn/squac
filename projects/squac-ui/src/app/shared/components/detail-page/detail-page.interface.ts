export interface TitleButtons {
  //if true, will show buttons & emit clicks
  deleteButton?: boolean;
  addButton?: boolean;
  editButton?: boolean;
  cancelButton?: boolean;
  closeButton?: boolean;
  useText?: boolean;
}

export interface PageOptions {
  titleButtons?: TitleButtons;
  path?: string;
}
