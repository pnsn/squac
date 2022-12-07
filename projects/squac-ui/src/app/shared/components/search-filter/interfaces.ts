export interface SearchFilterConfig {
  text: string;
  props: (string | SearchProps)[];
}

export interface SearchProps {
  prop: string;
  props: (string | SearchProps)[];
}
