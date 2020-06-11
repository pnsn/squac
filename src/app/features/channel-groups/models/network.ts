export class Network {
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public description: string
  ) {

  }


  static get modelName() {
    return 'Network';
  }
}

