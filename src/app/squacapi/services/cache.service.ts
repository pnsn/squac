import { Injectable } from "@angular/core";

const DEFAULT_MAX_AGE = 60; /** Max age of stored data */
/**
 * Service for storing data on front end
 */
@Injectable()
export class CacheService {
  data = new Map<string, any>();
  expirations = new Map<string, number>();

  constructor() {}

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
      : DEFAULT_MAX_AGE * 1000 + now;
    this.expirations.set(key, expirationTime);
  }

  getData(key: any): any {
    console.log("get data", key, this.data.get(key));
    return this.data.get(key);
  }

  removeData(key: any): void {
    this.data.delete(key);
    this.expirations.delete(key);
  }
}
