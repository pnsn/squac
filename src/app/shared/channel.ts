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
    public name : string,
    public code : string,
    public sample_rate : number,

    //from loc
    public lat : number,
    public lon: number,
    public elev : number,
    public loc : string,
  ){}

  setStation(id: number, code: string, name: string){
    this.stationId = id;
    this.stationCode = code;
    this.stationName = name;
  }

  setNetwork(id: number, code: string, name: string){
    this.networkId = id;
    this.networkCode = code;
    this.networkName = name;
  }

get nslc() : string {
    return this.networkCode + "." + this.stationCode + "." + this.loc+ "." + this.code;
  }
}
