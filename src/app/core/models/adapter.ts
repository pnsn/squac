// generic interface for adapters
// Used for converting SquacApi json into typescript objects
export interface Adapter<T> {
  adapt(item: any): T;
}