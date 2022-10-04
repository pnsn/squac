import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  // remove
  // update
  //cleanup
  // interact with local storage

  //check for staorage errors

  //string must be jsonified
  constructor() {
    console.log("storage service made");
  }
  defaultMaxAge = 60; //seconds

  data = new Map<any, any>();

  expirations = new Map<any, number>();

  hasData(key): boolean {
    const now = new Date().getTime();
    if (this.expirations.has(key) && this.expirations.get(key) > now) {
      return true; //less than 5 minutes old
    }
    //expired data so remove
    this.removeData(key);
    return false;
  }

  setData(key: any, data: any, maxAgeInSeconds?: number): void {
    this.data.set(key, data);

    // 5 minutes from now
    const now = new Date().getTime();
    const expirationTime = maxAgeInSeconds
      ? maxAgeInSeconds * 1000 + now
      : this.defaultMaxAge * 1000 + now;
    this.expirations.set(key, expirationTime);
  }

  getData(key: any): any {
    return this.data.get(key);
  }

  removeData(key: any): void {
    this.data.delete(key);
    this.expirations.delete(key);
  }

  //store raw squac data and repeat processing?
  private setLocalStorage(key: string, item: string): void {
    //JSON.stringify(authData)?
    localStorage.setItem(key, item);
  }

  private getLocalStorage(key: string): string {
    //return string or json?
    const data = localStorage.getItem(key);
    return data;
  }

  private removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  private clearLocalStorage(): void {
    localStorage.clear();
  }
}
