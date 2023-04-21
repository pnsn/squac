import { camelCase } from "../utils/utils";

export interface BaseModel {
  id?: number;
  user?: number;
  organization?: number;
  /** convert model to json */
  toJson(): any;
  /** convert json to model */
  fromRaw(data: any): void;
}

/**
 * Constructs object of type
 *
 * @param type type of class to construct
 * @param apiData data to populate object with
 * @returns created object
 */
export function modelConstructor<T extends BaseModel>(
  type: { new (data): T },
  apiData: any
): T {
  return new type(apiData);
}

/**
 * Static method class
 */
export class BaseModel implements BaseModel {
  /**
   * Deserializes json data and creates an object with it
   *
   * @param this this constructor
   * @param data data to create with
   * @returns newly created object
   */
  static deserialize<T extends BaseModel>(
    this: { new (data: any): T } & typeof BaseModel,
    data: any
  ): T {
    return new this(data);
  }

  /**
   * Serializes object
   *
   * @param obj object to serialize
   * @returns json response
   */
  static serialize<T extends BaseModel, W>(obj: T): W {
    return obj.toJson();
  }
}

/**
 * Resource model for read only resources
 */
export abstract class ReadOnlyResourceModel<R> extends BaseModel {
  /**
   * Converts raw data to object
   *
   * @param data raw data
   */
  override fromRaw(data: R | Partial<ReadOnlyResourceModel<R>>): void {
    Object.keys(data).forEach((key) => {
      const camelcasedKey = camelCase(key);
      this[camelcasedKey] = data[key];
    });
  }

  constructor(model?: Partial<R> | Partial<ReadOnlyResourceModel<R>>) {
    super();

    if (model) {
      this.fromRaw(model);
    }
  }

  /**
   * @returns id of object owner
   */
  get owner(): number {
    return this.user;
  }

  /** @returns if of object organization */
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
