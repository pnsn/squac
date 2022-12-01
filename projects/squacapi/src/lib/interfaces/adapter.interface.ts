// generic interface for adapters
// Used for converting SquacApi json into objects
export interface Adapter<T, R, S> {
  adaptFromApi(item: R): T;
  adaptToApi?(item: T): S;
}
