/** locale type */
export interface Locale {
  /** format for dates */
  format: string;
  /** display format for dates */
  displayFormat: string;
  /** direction for displaying data */
  direction: "ltr";
}

/** default locale */
export const DEFAULT_LOCALE: Locale = {
  format: "YYYY-MM-DDTHH:mm:ss[Z]",
  displayFormat: "YYYY/MM/DD HH:mm",
  direction: "ltr",
};
