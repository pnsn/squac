import {
  ColumnMode,
  SelectionType,
  SortPropDir,
  SortType,
} from "@boring.devs/ngx-datatable";
import { SearchFilterConfig } from "../search-filter/interfaces";

export type MenuAction = "edit" | "add" | "view" | "delete" | string;
export type MenuPermission = "read" | "create" | "update" | "delete";

export interface TableMessages {
  emptyMessage?: string;
  totalMessage?: string;
  selectedMessage?: string;
}
export interface TableOptions {
  columnMode?: ColumnMode;
  selectionType?: SelectionType;
  headerHeight?: number;
  footerHeight?: number;
  rowHeight?: number | "auto";
  limit?: number;
  reorderable?: boolean;
  scrollbarH?: boolean;
  scrollbarV?: boolean;
  sortType?: SortType;
  sorts?: SortPropDir[];
  groupRowsBy?: string;
  groupExpansionDefault?: boolean;
  groupParentType?: string;
  autoRouteToDetail?: boolean;
  selectAllRowsOnPage?: boolean;
  displayCheck?: boolean;
  messages?: TableMessages;
  virtualization?: false;
  footerLabel?: string;
}

export interface TableControls {
  resource: string;
  listenToRouter?: boolean;
  basePath?: string;
  add?: ResourceLink;
  menu?: TableMenuConfig;
  edit?: ResourceLink;
  refresh?: boolean;
  links?: TableLink[];
}

export interface TableFilters {
  toggleShared?: boolean;
  searchField?: SearchFilterConfig;
}

export interface TableMenuOptionConfig {
  action: MenuAction;
  permission?: MenuPermission;
  text: string;
}

export interface ResourceLink {
  text: string;
  path?: string;
}

export interface TableLink extends ResourceLink {
  path: string;
}

export interface TableMenuConfig extends ResourceLink {
  options: TableMenuOptionConfig[];
}
