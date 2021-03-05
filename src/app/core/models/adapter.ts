// generic interface for adapters
// Used for converting SquacApi json into typescript objects
export interface Adapter<T> {
  adaptFromApi(item: any): T;
  adaptToApi?(item: T): any;
}
