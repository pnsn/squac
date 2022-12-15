/**
 * Adapts to/from api
 *
 * @template T model to adapt
 * @template R api read type
 * @template S api write type
 * TODO: replace with serializer methods
 */
export interface Adapter<T, R, S> {
  /**
   * Convert api item to model
   *
   * @param item - api item to adapt
   * @returns adapted model
   */
  adaptFromApi(item: R): T;

  /**
   * converts model to api item
   *
   * @param item - model
   * @returns api item
   */
  adaptToApi?(item: T): S;
}
