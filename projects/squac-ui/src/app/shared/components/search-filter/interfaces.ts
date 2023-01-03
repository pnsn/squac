/** config for search filter */
export interface SearchFilterConfig {
  /** default text in filter */
  text: string;
  /** properties to search in */
  props: SearchProp[];
}

/** searchable properties on objects */
export interface SearchProps {
  /** property name */
  prop: string;
  /** nested properties */
  props: SearchProp[];
}

export type SearchProp = string | SearchProps;
