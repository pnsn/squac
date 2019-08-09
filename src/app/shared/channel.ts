export class Channel {
  constructor(
    public chaName : string,
    public cha : string,
    public sample_rate : number,

    //from loc
    public lat : number,
    public lon: number,
    public elev : number,
    public loc : string,

    //from sta
    public staName : string,
    public sta : string,

    //from net
    public net : string,
    public netName : string
  ){}

  get nslc() : string {
    return this.net + "." + this.sta + "." + this.loc+ "." + this.cha;
  }
}
