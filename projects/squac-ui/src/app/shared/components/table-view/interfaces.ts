import {
  ColumnMode,
  SelectionType,
  SortPropDir,
  SortType,
} from "@boring.devs/ngx-datatable";
import { SearchFilterConfig } from "../search-filter/interfaces";

export type MenuAction = "edit" | "add" | "view" | "delete" | string;
export type MenuPermission = "read" | "create" | "update" | "delete";

/** Table messages */
export interface TableMessages {
  /** message shown when no rows */
  emptyMessage?: string;
  /** message next to count of rows */
  totalMessage?: string;
  /** message next to count of selected rows */
  selectedMessage?: string;
}

/** Table configuration options, see ngx-datatable */
export interface TableOptions {
  /** column type */
  columnMode?: ColumnMode;
  /** selection type */
  selectionType?: SelectionType;
  /** height of header */
  headerHeight?: number;
  /** height of footer */
  footerHeight?: number;
  /** height of rows */
  rowHeight?: number | "auto";
  /** limit number of rows to show */
  limit?: number;
  /** can reorder columns? */
  reorderable?: boolean;
  /** show horizontal scrollbar */
  scrollbarH?: boolean;
  /** show vertical scrollbar */
  scrollbarV?: boolean;
  /** sort options */
  sortType?: SortType;
  /** sort properties */
  sorts?: SortPropDir[];
  /** row grouping property */
  groupRowsBy?: string;
  /** true if rows should be grouped by default */
  groupExpansionDefault?: boolean;
  /** group parent model type */
  groupParentType?: string;
  /** true if tabel should route to detail page */
  autoRouteToDetail?: boolean;
  /** true if should show option to select all rows on page */
  selectAllRowsOnPage?: boolean;
  /** true if checkboxes should be available for rows */
  displayCheck?: boolean;
  /** table messages */
  messages?: TableMessages;
  /** true if use virtualization */
  virtualization?: false;
  /** Footer label text */
  footerLabel?: string;
}

/** Table control configuration */
export interface TableControls {
  /** resource model type */
  resource: string;
  /** true if table should listen to router events */
  listenToRouter?: boolean;
  /** base path for navigation */
  basePath?: string;
  /** add button */
  add?: ResourceLink;
  /** menu option */
  menu?: TableMenuConfig;
  /** edit button */
  edit?: ResourceLink;
  /** refresh button */
  refresh?: boolean;
  /** links on table */
  links?: TableLink[];
}

/** Filter options for table */
export interface TableFilters {
  /** show sharing filter */
  toggleShared?: boolean;
  /** search field config */
  searchField?: SearchFilterConfig;
}

/** Config for table menu options */
export interface TableMenuOptionConfig {
  /** type of action */
  action: MenuAction;
  /** required permissions */
  permission?: MenuPermission;
  /** menu text */
  text: string;
}

/** link info */
export interface ResourceLink {
  /** link text */
  text: string;
  /** link path */
  path?: string;
}

/** Table link requires path */
export interface TableLink extends ResourceLink {
  path: string;
}

/** Table menu config */
export interface TableMenuConfig extends ResourceLink {
  /** table menu options */
  options: TableMenuOptionConfig[];
}
