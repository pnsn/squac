/**
 * Base squacapi object
 */
export interface SquacObject {
  id?: number;
}

export type SquacType = {
  app: string;
};

export abstract class SquacModel {
  static app: string;
  static model: string;
  static serialize?: (t: any) => string;
  static deserialize: (s: string) => any;
  // id?: number;
}

//apiService.
export class Test extends SquacModel {
  static app = "testtest";
  static model = "testmodel";
}

export enum ApiEndpoint {
  TEST,
}

export const ApiRoutes: {
  [key in ApiEndpoint]: typeof SquacModel;
} = {
  [ApiEndpoint.TEST]: Test,
};
