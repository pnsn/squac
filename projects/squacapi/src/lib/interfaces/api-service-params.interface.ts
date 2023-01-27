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

export type Params = any;

export interface ReadParams {
  id: number;
}

export interface DeleteParams {
  id: number;
}

export interface UpdateParams {
  id: number;
  data: any;
}

export interface CreateParams {
  data: any;
}

export interface ReadSerializer {
  id?: number;
}

export interface PartialUpdateParams {
  id?: number;
  data: any;
}
