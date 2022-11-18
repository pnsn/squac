export interface Locale {
  format: string;
  displayFormat: string;
  direction: "ltr";
}

export const DEFAULT_LOCALE: Locale = {
  format: "YYYY-MM-DDTHH:mm:ss[Z]",
  displayFormat: "YYYY/MM/DD HH:mm",
  direction: "ltr",
};
