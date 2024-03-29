import { TemplateRef } from "@angular/core";
import { SortDirection } from "@angular/material/sort";
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

/** columns to display on table */
export interface TableColumn {
  /** display name for column */
  name: string;
  /**
   * column identifier string if different than lower cased name,
   * will define the sorting property
   */
  columnDef?: string;
  cellTemplate?: TemplateRef<any>;
}

/** Table configuration options */
export interface TableOptions {
  /** limit number of rows to show */
  // limit?: number;
  /** can reorder columns? */
  // reorderable?: boolean;
  /** true if tabel should route to detail page */
  autoRouteToDetail?: boolean;
  /** true if should show option to select all rows on page */
  // selectAllRowsOnPage?: boolean;
  /** table messages */
  messages?: TableMessages;
  /** Footer label text */
  footerLabel?: string;
  /** Default sort column */
  defaultSort?: string;
  /** Default diretion for sorting */
  defaultSortDir?: SortDirection;
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
