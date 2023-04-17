import { HttpContext } from "@angular/common/http";

/**
 * Options for requests
 */
export interface Options {
  /** if true, will not use the cache */
  refresh?: boolean;
}

/** HttpOptions for requests */
export interface HttpOptions {
  /** Http context */
  context?: HttpContext;
}

/** Param type for typing */
export type Params = any;

/** Params for read request */
export interface ReadParams {
  id: number;
}

/** Params for delete request */
export interface DeleteParams {
  id: number;
}

/** Params for update request */
export interface UpdateParams {
  id: number;
  data: any;
}

/** Params for create request */
export interface CreateParams {
  data: any;
}

/** Base interface for read serializers */
export interface ReadSerializer {
  id?: number;
}

/** Params for partial update */
export interface PartialUpdateParams {
  id?: number;
  data: any;
}
