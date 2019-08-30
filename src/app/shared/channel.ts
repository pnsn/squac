import { Station } from '../channel-groups/station';

// Describes a channel object
export class Channel {

  // //from sta
  // public stationId : number;
  // public stationName : string;
  // public stationCode : string;
  // //from net

  // public networkId : number;
  // public  networkCode : string;
  // public  networkName : string;

  constructor(
    public id: number,
    public code : string,
    public name : string,
    public sample_rate : number,

    //from loc
    public lat : number,
    public lon: number,
    public elev : number,
    public loc : string,
    public stationCode : string, 
    public networkCode : string
  ){}

  get nslc() : string {
    return this.networkCode + "." + this.stationCode + "." + this.loc+ "." + this.code;
  }
}
