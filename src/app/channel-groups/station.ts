import { Network } from './network';

export class Station {
  constructor(
  public id : number,
  public code : string,
  public name : string,
  public description : string,
  public network? : Network)
  {

  }


  // set network (network : Network) {
  //   this.network = network;
  // }
}
