import { ReadNetwork } from "../interfaces";

/**
 * describes a network
 */
export class Network {
  id: number;
  constructor(
    public code: string,
    public name: string,
    public description: string
  ) {}

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Network";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadNetwork): Network {
    return new Network(item.code, item.name, item.description);
  }
}
