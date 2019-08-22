import { Station } from '../channel-groups/station';

export class Channel {

  //from sta
  public stationId : number;
  public stationName : string;
  public stationCode : string;
  //from net

  public networkId : number;
  public  networkCode : string;
  public  networkName : string;

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
  ){}

  set station (station : Station) {
    this.station = station;
  }

get nslc() : string {
    return this.networkCode + "." + this.station.code + "." + this.loc+ "." + this.code;
  }
}
