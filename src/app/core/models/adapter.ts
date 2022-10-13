// generic interface for adapters
// Used for converting SquacApi json into objects
export interface Adapter<T> {
  adaptFromApi(item: any, stat?: any): T;
  adaptToApi?(item: T): any;
}
