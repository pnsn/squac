/**
 * Base squacapi object
 */
export interface SquacObject {
  id?: number;
}

export interface SquacModel {
  id?: number;
  user?: number;
  organization?: number;
  /** convert model to json */
  toJson(): any;
  /** convert json to model */
  fromRaw(data: any): void;
}

/**
 * Static method class
 */
export class SquacModel implements SquacModel {
  /**
   * Deserialize and return object
   *
   * @param data
   * @returns
   */
  static deserialize<T extends SquacModel>(
    this: { new (data: any): T } & typeof SquacModel,
    data: any
  ): T {
    return new this(data);
  }

  /**
   * Serializes object
   *
   * @param obj
   * @returns
   */
  static serialize<T extends SquacModel, W>(obj: T): W {
    return obj.toJson();
  }
}

/**
 * Resource model for read only resources
 */
export abstract class ReadOnlyResourceModel<R> extends SquacModel {
  override fromRaw(data: R): void {
    Object.assign(this, data);
  }

  constructor(model?: R) {
    super();
    if (model) {
      this.fromRaw(model);
    }
  }

  get owner(): number {
    return this.user;
  }

  get orgId(): number {
    return this.organization;
  }
}

/**
 * Resource model for writeable resources
 */
export abstract class ResourceModel<R, W> extends ReadOnlyResourceModel<R> {
  abstract override toJson(): W;
}
