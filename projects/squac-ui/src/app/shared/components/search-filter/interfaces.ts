export interface SearchFilterConfig {
  text: string;
  props: SearchProp[];
}

export interface SearchProps {
  prop: string;
  props: SearchProp[];
}

export type SearchProp = string | SearchProps;
